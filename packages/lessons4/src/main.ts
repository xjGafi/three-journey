import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  EquirectangularReflectionMapping,
  ACESFilmicToneMapping,
  sRGBEncoding
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import RoyalEsplanade from '../../../assets/textures/royal_esplanade_1k.hdr?url';
// import DamagedHelmet from '../../../assets/models/DamagedHelmet.gltf?url';  // 贴图加载不出来
const DamagedHelmet =
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf';

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;

init();
render();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.25, 20);
  camera.position.set(-1.8, 0.6, 2.7);

  // Scene
  scene = new Scene();

  // Object
  new RGBELoader().load(RoyalEsplanade, function (texture) {
    texture.mapping = EquirectangularReflectionMapping;

    scene.background = texture;
    scene.environment = texture;

    render();

    // 3D Model
    const loader = new GLTFLoader();
    loader.load(DamagedHelmet, function (gltf) {
      scene.add(gltf.scene);

      render();
    });
  });

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({
    canvas
  });
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = sRGBEncoding;

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0, -0.2);
  controls.update();

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
