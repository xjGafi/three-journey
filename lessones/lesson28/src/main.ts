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
  PointLight,
  CubeTexture
} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Pane } from 'tweakpane';

// 全景图
import { textureMap } from './textures';

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats;

// 反射、折射球体网格模型
let reflectionMesh: Mesh, refractionMesh: Mesh;

interface Params {
  texture: string;
  reflectivity: number;
  refractionRatio: number;
  [key: string]: unknown;
}
// GUI 设置项
const PARAMS: Params = {
  texture: 'bridge',
  reflectivity: 1, // 反射率
  refractionRatio: 0.98 // 折射比
};

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

  // Pane
  initPane();

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 500;
  controls.maxDistance = 2000;
  controls.update();

  // Resize
  window.addEventListener('resize', onWindowResize);
}

// 添加 CubeTexture 材质的球体模型
function addCubeTexture() {
  const geometry = new SphereGeometry(150, 100, 100);
  let material: MeshLambertMaterial;

  // 加载材质贴图
  const urls = textureMap[PARAMS.texture];
  const cubeTextures = getCubeTextures(urls);

  // 设置反射材质球
  material = new MeshLambertMaterial({
    envMap: cubeTextures.reflectionTexture,
    reflectivity: PARAMS.reflectivity // 反射率
  });
  // 设置反射材质球体网格模型
  reflectionMesh = new Mesh(geometry, material);
  reflectionMesh.position.set(-200, 0, 0);
  scene.add(reflectionMesh);

  // 设置折射材质球
  material = new MeshLambertMaterial({
    envMap: cubeTextures.refractionTexture,
    refractionRatio: PARAMS.refractionRatio // 折射比
  });
  // 设置折射材质球体网格模型
  refractionMesh = new Mesh(geometry, material);
  refractionMesh.position.set(200, 0, 0);
  scene.add(refractionMesh);
}

interface LoadCubeTexture {
  reflectionTexture: CubeTexture;
  refractionTexture: CubeTexture;
}
// 加载材质贴图
function getCubeTextures(urls: Array<string>): LoadCubeTexture {
  // 实例化 CubeTexture 加载器
  const cubeTextureLoader = new CubeTextureLoader();

  // 设置反射材质
  const reflectionTexture = cubeTextureLoader.load(urls);

  // 设置折射材质
  const refractionTexture = cubeTextureLoader.load(urls);
  refractionTexture.mapping = CubeRefractionMapping;

  // 设置场景背景为反射材质
  scene.background = reflectionTexture;

  return { reflectionTexture, refractionTexture };
}

function initPane() {
  const pane = new Pane({ title: 'Material' });
  // 修改材质贴图
  pane
    .addInput(PARAMS, 'texture', {
      options: textureMap
    })
    .on('change', ({ value }) => {
      // 加载材质贴图
      const urls = value as unknown;
      const cubeTextures = getCubeTextures(urls as Array<string>);

      // 设置反射材质球体网格模型
      (reflectionMesh.material as MeshLambertMaterial).envMap =
        cubeTextures.reflectionTexture;

      // 设置折射材质球体网格模型
      (refractionMesh.material as MeshLambertMaterial).envMap =
        cubeTextures.refractionTexture;
    });
  // 修改反射率
  pane
    .addInput(PARAMS, 'reflectivity', {
      step: 0.01,
      min: 0,
      max: 1
    })
    .on('change', ({ value }) => {
      // 设置反射材质球体网格模型
      (reflectionMesh.material as MeshLambertMaterial).reflectivity = value;
    });
  // 修改折射比
  pane
    .addInput(PARAMS, 'refractionRatio', {
      step: 0.01,
      min: 0,
      max: 1
    })
    .on('change', ({ value }) => {
      // 设置折射材质球体网格模型
      (refractionMesh.material as MeshLambertMaterial).refractionRatio = value;
    });
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
