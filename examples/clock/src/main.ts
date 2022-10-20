import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  Color
} from 'three';

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;

let mesh: Mesh;

let time = '00:00:00';

init();
animate();

function init() {
  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
  camera.position.set(0, 0, 300);

  // Scene
  scene = new Scene();

  // Object
  const geometry = new PlaneGeometry(innerWidth, innerHeight);
  const material = new MeshBasicMaterial();
  mesh = new Mesh(geometry, material);
  scene.add(mesh);

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);

  render();
}

function animate() {
  requestAnimationFrame(animate);

  updateView();

  render();
}

function updateView() {
  const date = new Date();
  const zeroPadding = (num: number) => (num >= 10 ? `${num}` : `0${num}`);
  const h = zeroPadding(date.getHours());
  const m = zeroPadding(date.getMinutes());
  const s = zeroPadding(date.getSeconds());

  const currentTime = `${h}:${m}:${s}`;
  if (time !== currentTime) {
    const text = document.querySelector('h1#clock')!;
    text.innerHTML = currentTime;

    const timePercentage = (current: string, total: number) =>
      (Number(current) + 1) / total;
    const r = timePercentage(h, 24);
    const g = timePercentage(m, 60);
    const b = timePercentage(s, 60);
    (mesh.material as MeshBasicMaterial).color = new Color(r, g, b);
  }
  time = currentTime;
}

function render() {
  renderer.render(scene, camera);
}
