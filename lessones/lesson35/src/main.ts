import './style.css';
import {
  Bone,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SkinnedMesh,
  Skeleton,
  SkeletonHelper,
  Vector3,
  Uint16BufferAttribute,
  WebGLRenderer,
  AxesHelper
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Pane } from 'tweakpane';

interface Sizing {
  segmentHeight: number;
  segmentCount: number;
  height: number;
  halfHeight: number;
}

let scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer;

let mesh: SkinnedMesh;

const state = {
  animateBones: false
};

init();
animate();

function init() {
  // Scene
  scene = new Scene();

  // Axes
  const axesHelper = new AxesHelper(200);
  scene.add(axesHelper);

  // Canera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 200);
  camera.position.z = 30;
  camera.position.y = 30;

  // Light
  const lights = [];
  lights[0] = new PointLight(0xffffff, 1, 0);
  lights[1] = new PointLight(0xffffff, 1, 0);
  lights[2] = new PointLight(0xffffff, 1, 0);

  lights[0].position.set(0, 200, 0);
  lights[1].position.set(100, 200, 100);
  lights[2].position.set(-100, -200, -100);

  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);

  // Object
  addBones();

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // Pane
  initPane();

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function addBones() {
  const segmentHeight = 8;
  const segmentCount = 4;
  const height = segmentHeight * segmentCount;
  const halfHeight = height / 2;

  const sizing: Sizing = {
    segmentHeight: segmentHeight,
    segmentCount: segmentCount,
    height: height,
    halfHeight: halfHeight
  };

  const geometry = createGeometry(sizing);
  const bones = createBones(sizing);
  mesh = createMesh(geometry, bones);

  mesh.scale.multiplyScalar(1);
  scene.add(mesh);
}

function createGeometry(sizing: Sizing) {
  const geometry = new CylinderGeometry(
    5,
    5,
    sizing.height,
    8,
    sizing.segmentCount * 3,
    true
  );

  const position = geometry.attributes.position;

  const vertex = new Vector3();

  const skinIndices = [];
  const skinWeights = [];

  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);

    const y = vertex.y + sizing.halfHeight;

    const skinIndex = Math.floor(y / sizing.segmentHeight);
    const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight;

    skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
  }

  geometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute(
    'skinWeight',
    new Float32BufferAttribute(skinWeights, 4)
  );

  return geometry;
}

function createBones(sizing: Sizing) {
  const bones = [];

  let prevBone = new Bone();
  bones.push(prevBone);
  prevBone.position.y = -sizing.halfHeight;

  for (let i = 0; i < sizing.segmentCount; i++) {
    const bone = new Bone();
    bone.position.y = sizing.segmentHeight;
    bones.push(bone);
    prevBone.add(bone);
    prevBone = bone;
  }

  return bones;
}

function createMesh(
  geometry: CylinderGeometry,
  bones: Array<Bone>
): SkinnedMesh {
  const material = new MeshPhongMaterial({
    color: 0x156289,
    emissive: 0x072534,
    side: DoubleSide,
    flatShading: true
  });

  const mesh = new SkinnedMesh(geometry, material);
  const skeleton = new Skeleton(bones);

  mesh.add(bones[0]);

  mesh.bind(skeleton);

  const skeletonHelper = new SkeletonHelper(mesh);
  scene.add(skeletonHelper);

  return mesh;
}

function initPane() {
  const pane = new Pane();
  let folder = pane.addFolder({ title: 'General Options' });

  folder.addInput(state, 'animateBones', {
    label: 'Animate Bones'
  });

  folder
    .addButton({
      label: 'Mesh Attribute',
      title: 'reset'
    })
    .on('click', () => {
      mesh.pose();
    });

  const bones = mesh.skeleton.bones;

  for (let i = 0; i < bones.length; i++) {
    const bone = bones[i];

    folder = pane.addFolder({ title: 'Bone ' + i });

    folder.addInput(bone.position, 'x', {
      label: 'position.x',
      min: -10 + bone.position.x,
      max: 10 + bone.position.x
    });
    folder.addInput(bone.position, 'y', {
      label: 'position.y',
      min: -10 + bone.position.y,
      max: 10 + bone.position.y
    });
    folder.addInput(bone.position, 'z', {
      label: 'position.z',
      min: -10 + bone.position.z,
      max: 10 + bone.position.z
    });

    folder.addInput(bone.rotation, 'x', {
      label: 'rotation.x',
      min: -Math.PI * 0.5,
      max: Math.PI * 0.5
    });
    folder.addInput(bone.rotation, 'y', {
      label: 'rotation.y',
      min: -Math.PI * 0.5,
      max: Math.PI * 0.5
    });
    folder.addInput(bone.rotation, 'z', {
      label: 'rotation.z',
      min: -Math.PI * 0.5,
      max: Math.PI * 0.5
    });

    folder.addInput(bone.scale, 'x', {
      label: 'scale.x',
      min: 0,
      max: 2
    });
    folder.addInput(bone.scale, 'y', {
      label: 'scale.y',
      min: 0,
      max: 2
    });
    folder.addInput(bone.scale, 'z', {
      label: 'scale.z',
      min: 0,
      max: 2
    });
  }
}

function onWindowResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);

  render();
}

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // Wiggle the bones
  if (state.animateBones) {
    for (let i = 0; i < mesh.skeleton.bones.length; i++) {
      mesh.skeleton.bones[i].rotation.z = Math.sin(time);
    }
  }

  render();
}

function render() {
  renderer.render(scene, camera);
}
