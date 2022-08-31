import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
  Mesh,
  MeshLambertMaterial,
  AmbientLight,
  CubeTextureLoader,
  CubeRefractionMapping,
  SphereGeometry,
  PointLight
} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GUI } from 'dat.gui';

import star1 from '@/textures/star/px.jpg?url';
import star2 from '@/textures/star/nx.jpg?url';
import star3 from '@/textures/star/py.jpg?url';
import star4 from '@/textures/star/ny.jpg?url';
import star5 from '@/textures/star/pz.jpg?url';
import star6 from '@/textures/star/nz.jpg?url';

import park1 from '@/textures/park/px.jpg?url';
import park2 from '@/textures/park/nx.jpg?url';
import park3 from '@/textures/park/py.jpg?url';
import park4 from '@/textures/park/ny.jpg?url';
import park5 from '@/textures/park/pz.jpg?url';
import park6 from '@/textures/park/nz.jpg?url';

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats;

// 全景图
const textureMap = {
  star: [star1, star2, star3, star4, star5, star6],
  park: [park1, park2, park3, park4, park5, park6]
};
let textureList = textureMap.park;

init();
animate();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Canera
  camera = new PerspectiveCamera(50, innerWidth / innerHeight, 1, 5000);
  camera.position.z = 1000;

  // Scene
  scene = new Scene();

  // Light
  const ambient = new AmbientLight(0xffffff);
  scene.add(ambient);

  const pointLight = new PointLight(0xffffff, 2);
  scene.add(pointLight);

  // Object
  addCubeTexture();

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.outputEncoding = sRGBEncoding;

  // Stats
  stats = Stats();
  document.body.appendChild(stats.dom);

  // GUI
  // initGUI();

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 500;
  controls.maxDistance = 2000;
  controls.update();

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function addCubeTexture() {
  const geometry = new SphereGeometry(150, 100, 100);
  let material: MeshLambertMaterial;
  let mesh: Mesh;

  const cubeTextureLoader = new CubeTextureLoader();
  // 反射材质
  const reflectionCube = cubeTextureLoader.load(textureList);
  // 折射材质
  const refractionCube = cubeTextureLoader.load(textureList);
  refractionCube.mapping = CubeRefractionMapping;

  // 反射材质球
  material = new MeshLambertMaterial({
    envMap: reflectionCube
  });
  mesh = new Mesh(geometry, material);
  mesh.position.set(200, 0, 0);
  scene.add(mesh);

  // 折射材质球
  material = new MeshLambertMaterial({
    envMap: refractionCube
  });
  mesh = new Mesh(geometry, material);
  mesh.position.set(-200, 0, 0);
  scene.add(mesh);

  scene.background = reflectionCube;
}

// function initGUI() {
//   const settings = {
//     texture: 'star'
//   };
//   const gui = new GUI();
//   const settingsFolder = gui.addFolder('Background');
//   settingsFolder
//     .add(settings, 'texture', Object.keys(textureMap))
//     .onChange((key: string) => {
//       textureList = textureMap[key];
//     });
//   settingsFolder.open();
// }

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
