import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Mesh,
  PlaneGeometry,
  Color,
  DirectionalLight,
  MeshLambertMaterial,
  TextureLoader,
  AmbientLight,
  BoxGeometry,
  GridHelper,
  MeshBasicMaterial,
  Raycaster,
  Vector2
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

import grass from '@/textures/grass.png?url';

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats;

let plane: Mesh,
  rollOverMesh: Mesh,
  voxelGeo: BoxGeometry,
  voxelMaterial: MeshLambertMaterial;

const objects: Array<Mesh> = [];

let pointer: Vector2,
  raycaster: Raycaster,
  isShiftDown = false;

init();
animate();

function init() {
  // Scene
  scene = new Scene();
  scene.background = new Color(0xf0f0f0);

  // Camera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 10000);
  camera.position.set(500, 800, 1000);
  camera.lookAt(0, 0, 0);

  // Lights
  const ambientLight = new AmbientLight(0x606060);
  scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0xffffff);
  directionalLight.position.set(1, 0.75, 0.5).normalize();
  scene.add(directionalLight);

  // Object
  addModel();
  addGround();

  // 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
  raycaster = new Raycaster();
  pointer = new Vector2();

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 5;
  controls.maxDistance = 2000;
  controls.update();

  // Stats
  stats = Stats();
  document.body.appendChild(stats.dom);

  // Listener
  eventListener();
}

function addModel() {
  // roll-over helpers
  const rollOverGeo = new BoxGeometry(50, 50, 50);
  const rollOverMaterial = new MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0.5,
    transparent: true
  });
  rollOverMesh = new Mesh(rollOverGeo, rollOverMaterial);
  rollOverMesh.position.set(25, 25, 25);
  scene.add(rollOverMesh);

  // cubes
  voxelGeo = new BoxGeometry(50, 50, 50);
  voxelMaterial = new MeshLambertMaterial({
    map: new TextureLoader().load(grass)
  });
}

function addGround() {
  // Ground
  const geometry = new PlaneGeometry(1000, 1000);
  geometry.rotateX(-Math.PI / 2);
  const material = new MeshBasicMaterial({ visible: false });
  plane = new Mesh(geometry, material);
  scene.add(plane);

  objects.push(plane);

  // GridHelper
  const gridHelper = new GridHelper(1000, 20);
  scene.add(gridHelper);
}

function eventListener() {
  // Operate
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // Resize
  window.addEventListener('resize', onResize);
}

function getIntersect(event: PointerEvent) {
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  pointer.set(
    (event.clientX / innerWidth) * 2 - 1,
    -(event.clientY / innerHeight) * 2 + 1
  );

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(pointer, camera);

  // 计算物体和射线的焦点
  return raycaster.intersectObjects(objects, false);
}

function onPointerMove(event: PointerEvent) {
  const intersects = getIntersect(event);

  if (intersects.length > 0) {
    const intersect = intersects[0];

    // 更新位置
    rollOverMesh.position.copy(intersect.point).add(intersect!.face!.normal);
    rollOverMesh.position
      .divideScalar(50)
      .floor()
      .multiplyScalar(50)
      .addScalar(25);
  }
}

function onPointerDown(event: PointerEvent) {
  const intersects = getIntersect(event);

  if (intersects.length > 0) {
    const intersect = intersects[0];

    // delete voxel
    if (isShiftDown) {
      if (intersect.object !== plane) {
        scene.remove(intersect.object);

        const index = objects.indexOf(intersect.object as Mesh);
        objects.splice(index, 1);
      }

      // create voxel
    } else {
      const voxel = new Mesh(voxelGeo, voxelMaterial);
      voxel.position.copy(intersect.point).add(intersect!.face!.normal);
      voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
      scene.add(voxel);

      objects.push(voxel);
    }
  }
}

function onKeyDown(event: KeyboardEvent) {
  switch (event.code) {
    case 'ShiftLeft':
      isShiftDown = true;
      break;
  }
}

function onKeyUp(event: KeyboardEvent) {
  switch (event.code) {
    case 'ShiftLeft':
      isShiftDown = false;
      break;
  }
}

function onResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);

  render();
}

function animate() {
  requestAnimationFrame(animate);

  stats.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}
