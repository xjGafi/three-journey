import "./style.css";
import {
  PerspectiveCamera,
  Scene,
  PointLight,
  WebGLRenderer,
  MeshPhongMaterial,
  Mesh,
  PointLightHelper,
  AxesHelper,
} from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

import helvetikerRegular from "@/fonts/helvetiker_regular.typeface.json?url";

let camera: PerspectiveCamera,
  scene: Scene,
  pointLight: PointLight,
  renderer: WebGLRenderer,
  stats: Stats;

let time = 0;

init();
animate();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Camera
  //创建相机对象
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 1, 1000);
  camera.position.set(0, 0, 800);
  camera.lookAt(0, 0, 0);

  // Scene
  scene = new Scene();

  // Light
  pointLight = new PointLight(0xffffff, 1.5);
  pointLight.position.set(-350, 100, 90);
  scene.add(pointLight);

  const pointLightHelper = new PointLightHelper(pointLight, 10);
  scene.add(pointLightHelper);

  // Axes
  const axesHelper = new AxesHelper(500);
  scene.add(axesHelper);

  // Renderer
  const canvas = document.querySelector("canvas#webgl")!;
  renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // Object
  const loader = new FontLoader();
  loader.load(helvetikerRegular, (font) => {
    const textGeometry = new TextGeometry("Hello, three.js!", {
      font,
      size: 80,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 4,
      bevelSegments: 5,
    });
    const textMaterials = new MeshPhongMaterial({ color: 0x00ffff });
    const textMesh = new Mesh(textGeometry, textMaterials);
    textMesh.position.set(-350, 0, 0);
    scene.add(textMesh);
  });

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 50;
  controls.maxDistance = 800;
  controls.update();

  // Stats
  stats = Stats();
  document.body.appendChild(stats.dom);

  // Resize
  window.addEventListener("resize", onWindowResize);
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

  pointLight.position.x += 5 * Math.sin((time += 0.016));

  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}
