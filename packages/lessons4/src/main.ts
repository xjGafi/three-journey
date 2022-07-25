import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer;

init();
render();

function init() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.25,
    20
  );
  camera.position.set(-1.8, 0.6, 2.7);

  scene = new THREE.Scene();

  new RGBELoader()
    .setPath(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/equirectangular/'
    )
    .load('royal_esplanade_1k.hdr', function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;

      render();

      // model

      const loader = new GLTFLoader().setPath(
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/DamagedHelmet/glTF/'
      );
      loader.load('DamagedHelmet.gltf', function (gltf) {
        scene.add(gltf.scene);

        render();
      });
    });

  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new THREE.WebGLRenderer({
    canvas
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0, -0.2);
  controls.update();

  window.addEventListener('resize', resize);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function render() {
  renderer.render(scene, camera);
}
