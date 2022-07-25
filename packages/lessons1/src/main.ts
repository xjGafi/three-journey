import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three';

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;

let cube: Mesh;

init();
animate();

function init() {
  // Camera
  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 3;

  // Scene
  scene = new Scene();

  // Object
  const cubeGeometry = new BoxGeometry(1, 1, 1);
  const cubeMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
  cube = new Mesh(cubeGeometry, cubeMaterial);
  scene.add(cube);

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);

  render();
}

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  render();
}

function render() {
  renderer.render(scene, camera);
}
