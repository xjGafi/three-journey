import './style.css';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(0, 0, 500);
camera.lookAt(0, 0, 0);

// Scene
const scene = new THREE.Scene();

// Light
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(0, 100, 90);
scene.add(pointLight);

// Renderer
const canvas = document.querySelector('canvas#webgl')!;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Object
const loader = new FontLoader();
loader.load(
  'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json',
  (font) => {
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
    const textMaterials = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterials);
    textMesh.position.set(-330, 0, 0);
    scene.add(textMesh);

    renderer.render(scene, camera);
  }
);
