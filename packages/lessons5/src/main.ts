import './style.css';
import {
  BufferGeometry,
  Float32BufferAttribute,
  LineDashedMaterial,
  LineSegments,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;

let cube: LineSegments;

init();
animate();

function init() {
  const { innerWidth, innerHeight } = window;

  // Camera
  camera = new PerspectiveCamera(60, innerWidth / innerHeight, 1, 500);
  camera.position.set(0, 0, 100);

  // Scene
  scene = new Scene();

  // Object
  const geometry = boxGeometry(50, 50, 50);
  const material = new LineDashedMaterial({
    color: 0x00ff00,
    dashSize: 3,
    gapSize: 1
  });
  cube = new LineSegments(geometry, material);
  cube.computeLineDistances();
  scene.add(cube);

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function boxGeometry(
  width: number,
  height: number,
  depth: number
): BufferGeometry {
  width = width * 0.5;
  height = height * 0.5;
  depth = depth * 0.5;

  const position = [
    -width,
    -height,
    -depth,
    -width,
    height,
    -depth,

    -width,
    height,
    -depth,
    width,
    height,
    -depth,

    width,
    height,
    -depth,
    width,
    -height,
    -depth,

    width,
    -height,
    -depth,
    -width,
    -height,
    -depth,

    -width,
    -height,
    depth,
    -width,
    height,
    depth,

    -width,
    height,
    depth,
    width,
    height,
    depth,

    width,
    height,
    depth,
    width,
    -height,
    depth,

    width,
    -height,
    depth,
    -width,
    -height,
    depth,

    -width,
    -height,
    -depth,
    -width,
    -height,
    depth,

    -width,
    height,
    -depth,
    -width,
    height,
    depth,

    width,
    height,
    -depth,
    width,
    height,
    depth,

    width,
    -height,
    -depth,
    width,
    -height,
    depth
  ];
  const attribute = new Float32BufferAttribute(position, 3);
  const geometry = new BufferGeometry().setAttribute('position', attribute);

  return geometry;
}

function onWindowResize() {
  const { innerWidth, innerHeight } = window;

  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);

  render();
}

function animate() {
  const time = Date.now() * 0.001;

  requestAnimationFrame(animate);

  cube.rotation.x = 0.25 * time;
  cube.rotation.y = 0.25 * time;

  render();
}

function render() {
  renderer.render(scene, camera);
}
