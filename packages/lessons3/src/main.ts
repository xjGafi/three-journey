import './style.css';
import {
  PerspectiveCamera,
  Scene,
  PointLight,
  WebGLRenderer,
  MeshPhongMaterial,
  Mesh
} from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import helvetikerRegular from '../../../assets/fonts/helvetiker_regular.typeface.json?url';

let camera: PerspectiveCamera,
  scene: Scene,
  pointLight: PointLight,
  renderer: WebGLRenderer;

let time = 0;

init();
animate();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Camera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 1, 1000);
  camera.position.set(0, 0, 500);
  camera.lookAt(0, 0, 0);

  // Scene
  scene = new Scene();

  // Light
  pointLight = new PointLight(0xffffff, 1.5);
  pointLight.position.set(0, 100, 90);
  scene.add(pointLight);

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(innerWidth, innerHeight);

  // Object
  const loader = new FontLoader();
  loader.load(helvetikerRegular, (font) => {
    const textGeometry = new TextGeometry('Hello, three.js!', {
      font,
      size: 80,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 4,
      bevelSegments: 5
    });
    const textMaterials = new MeshPhongMaterial({ color: 0x00ff00 });
    const textMesh = new Mesh(textGeometry, textMaterials);
    textMesh.position.set(-330, 0, 0);
    scene.add(textMesh);
  });

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

  pointLight.position.x += 5 * Math.sin((time += 0.016));

  render();
}

function render() {
  renderer.render(scene, camera);
}
