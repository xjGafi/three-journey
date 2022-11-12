import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
  Clock,
  ConeGeometry,
  Mesh,
  TorusGeometry,
  TorusKnotGeometry,
  MeshToonMaterial,
  NearestFilter,
  TextureLoader,
  DirectionalLight,
  Group,
  Color
} from 'three';

import gsap from 'gsap';

import gradientUrl from '@/textures/gradients/5.jpg?url';

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer;

const cameraBox = new Group();

let material: MeshToonMaterial;
const objectsDistance = 4
let meshes: Array<Mesh> = [];

let scrollY = window.scrollY;
let currentSection = 0;
const cursor = {
  x: 0,
  y: 0
}

const clock = new Clock();
let previousTime = 0;

init();
animate();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Scene
  scene = new Scene();

  // Canera
  camera = new PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 6;
  cameraBox.add(camera);
  scene.add(cameraBox);

  // Lights
  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 0);
  scene.add(directionalLight);

  // Object
  addObjects();

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.outputEncoding = sRGBEncoding;

  // Scroll
  window.addEventListener('scroll', onScroll);

  // Mouse
  window.addEventListener('mousemove', onMouseMove)

  // Resize
  window.addEventListener('resize', onResize);
}

function addObjects() {
  // texture
  const textureLoader = new TextureLoader()
  const gradientTexture = textureLoader.load(gradientUrl)
  gradientTexture.magFilter = NearestFilter

  // material
  material = new MeshToonMaterial({
    gradientMap: gradientTexture
  })

  // mesh
  const mesh1 = new Mesh(
    new TorusGeometry(1, 0.4, 16, 60),
    material
  );
  const mesh2 = new Mesh(
    new ConeGeometry(1, 2, 32),
    material
  );
  const mesh3 = new Mesh(
    new TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
  );

  mesh1.position.x = 2;
  mesh2.position.x = - 2;
  mesh3.position.x = 2;

  mesh1.position.y = - objectsDistance * 0;
  mesh2.position.y = - objectsDistance * 1;
  mesh3.position.y = - objectsDistance * 2;

  meshes = [mesh1, mesh2, mesh3];

  scene.add(...meshes);
}

function onScroll() {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / window.innerHeight);

  if (newSection != currentSection) {
    currentSection = newSection;

    gsap.to(
      meshes[currentSection].rotation,
      {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=6',
        y: '+=3',
        z: '+=1.5'
      }
    );
  }
}

function onMouseMove(event: MouseEvent) {
  cursor.x = event.clientX / innerWidth - 0.5;
  cursor.y = event.clientY / innerHeight - 0.5;
}

function onResize() {
  const { innerWidth, innerHeight } = window;

  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);

  render();
}

function animate() {
  requestAnimationFrame(animate);

  /**
   * Color
   */
  const body = document.body;
  const progress = scrollY / (body.offsetHeight - window.innerHeight);
  const color = new Color(progress, 1, (1 - progress));

  // material
  material.color = color;

  // sence
  scene.background = color;

  /**
   * Animate
   */
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // camera
  camera.position.y = - scrollY / window.innerHeight * objectsDistance;
  const parallaxX = cursor.x * 0.5;
  const parallaxY = - cursor.y * 0.5;
  cameraBox.position.x += (parallaxX - cameraBox.position.x) * 5 * deltaTime;
  cameraBox.position.y += (parallaxY - cameraBox.position.y) * 5 * deltaTime;

  // meshes
  for (const mesh of meshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  render();
}

function render() {
  renderer.render(scene, camera);
}

