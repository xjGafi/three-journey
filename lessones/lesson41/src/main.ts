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
  Color,
  BufferAttribute,
  BufferGeometry,
  Points,
  PointsMaterial
} from 'three';

import gsap from 'gsap';

import gradientUrl from '@/textures/gradients/5.jpg?url';

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer;

const cameraBox = new Group();

const textureLoader = new TextureLoader();
const gradientTexture = textureLoader.load(gradientUrl);
gradientTexture.magFilter = NearestFilter;
const meshMaterial = new MeshToonMaterial();
const particlesMaterial = new PointsMaterial();
const objectsDistance = 4;
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
  addMeshes();
  addParticles();

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

function addMeshes() {
  // Material
  meshMaterial.gradientMap = gradientTexture;

  // Mesh
  const mesh1 = new Mesh(
    new TorusGeometry(1, 0.4, 16, 60),
    meshMaterial
  );
  const mesh2 = new Mesh(
    new ConeGeometry(1, 2, 32),
    meshMaterial
  );
  const mesh3 = new Mesh(
    new TorusKnotGeometry(0.8, 0.35, 100, 16),
    meshMaterial
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

function addParticles() {
  // Geometry
  const particlesCount = 1000;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    positions[i3 + 0] = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * meshes.length;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;
  }

  const particlesGeometry = new BufferGeometry();
  particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3));

  // Material
  particlesMaterial.sizeAttenuation = true;
  particlesMaterial.size = 0.03;

  // Points
  const particles = new Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

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
  const getColor = (offset: number, scale = 1) => new Color(Math.abs(progress - offset) * scale, Math.abs(1 - offset) * scale, Math.abs(1 - progress - offset) * scale);

  // font
  const color = getColor(0, 255);
  body.style.setProperty('--font-color', `rgb(${color.r},${color.g},${color.b})`);

  // meshes
  meshMaterial.color = getColor(0.1);

  // particles
  particlesMaterial.color = getColor(0.1);

  // sence
  scene.background = getColor(0.2);

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

