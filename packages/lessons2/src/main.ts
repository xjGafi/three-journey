import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  Line
} from 'three';

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;

init();
render();

function init() {
  const { innerWidth, innerHeight } = window;

  // Camera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 500);
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);

  // Scene
  scene = new Scene();

  // Object
  // 定义材质
  const lineMaterial = new LineBasicMaterial({ color: 0xff0000 });
  // 定义带有一些顶点的 几何体
  const linePoints = [
    new Vector3(-10, 0, 0),
    new Vector3(0, 10, 0),
    new Vector3(10, 0, 0)
  ];
  const lineGeometry = new BufferGeometry().setFromPoints(linePoints);
  // 组合线条
  const line = new Line(lineGeometry, lineMaterial);
  scene.add(line);

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);

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

function render() {
  renderer.render(scene, camera);
}
