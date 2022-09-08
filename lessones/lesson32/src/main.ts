import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
  Clock,
  AnimationMixer,
  GridHelper,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  Color,
  Fog,
  Material,
  DirectionalLight,
  HemisphereLight,
  SkinnedMesh
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import SimpleSkinning from '@/models/SimpleSkinning.gltf?url';

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;

let grid: GridHelper;

let mixer: AnimationMixer;

const clock = new Clock();

init();
animate();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
  camera.position.set(18, 6, 18);

  // Scene
  scene = new Scene();
  scene.background = new Color(0xa0a0a0);
  scene.fog = new Fog(0xa0a0a0, 70, 100);

  // Grid
  grid = new GridHelper(500, 100, 0x000000, 0x000000);
  grid.position.y = -5;
  (grid.material as Material).opacity = 0.2;
  (grid.material as Material).transparent = true;
  scene.add(grid);

  // Light
  const hemiLight = new HemisphereLight(0xffffff, 0x444444, 0.6);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);

  const dirLight = new DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(0, 20, 10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 18;
  dirLight.shadow.camera.bottom = -10;
  dirLight.shadow.camera.left = -12;
  dirLight.shadow.camera.right = 12;
  scene.add(dirLight);

  // Object
  addGround();
  addKeyframeAnimation();

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = sRGBEncoding;

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 5;
  controls.maxDistance = 50;
  controls.update();

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function addGround() {
  const geometry = new PlaneGeometry(500, 500);
  const material = new MeshPhongMaterial({
    color: 0x999999,
    depthWrite: false
  });

  const ground = new Mesh(geometry, material);
  ground.position.set(0, -5, 0);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
}

function addKeyframeAnimation() {
  // 3D Model
  const loader = new GLTFLoader();
  loader.load(SimpleSkinning, (gltf) => {
    // console.log('🌈 gltf:', gltf);
    scene.add(gltf.scene);

    gltf.scene.traverse((child) => {
      if ((child as SkinnedMesh).isSkinnedMesh) child.castShadow = true;
    });

    // gltf.scene 作为混合器的参数，可以播放 gltf.scene 包含的帧动画数据
    mixer = new AnimationMixer(gltf.scene);
    // gltf.animations[0]：获得剪辑 clip 对象
    // 剪辑 clip 作为参数，通过混合器 clipAction 方法返回一个操作对象 AnimationAction
    const controller = mixer.clipAction(gltf.animations[0]);
    controller.timeScale = 0.5;
    controller.play();
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
  if (typeof mixer !== 'undefined') {
    // 获得两帧的时间间隔
    const getDelta = clock.getDelta();
    // 更新混合器相关的时间
    mixer.update(getDelta);

    // 地板网格后移，产生模型向前走的效果
    grid.position.z -= getDelta * 5;
  }

  render();
}

function render() {
  renderer.render(scene, camera);
}
