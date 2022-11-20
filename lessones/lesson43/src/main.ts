import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

import * as CANNON from "cannon-es";

import { Pane } from "tweakpane"

interface Model {
  mesh: THREE.Mesh
  body: CANNON.Body
}

/**
 * Common
 */
const { innerWidth, innerHeight, devicePixelRatio } = window;
const near = 1, far = 50;

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, near, 2 * far);
camera.position.set(0, 10, 10);

/**
 * Physics
 */
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)
});

/**
 * Objects
 */
const objects: Array<Model> = [];

// Create Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
});
function cubeGenerator(width: number, height: number, depth: number, x: number, y: number, z: number) {
  // Model
  const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(new THREE.Vector3(x, y, z));
  scene.add(mesh);

  // Physic
  const halfSize = new CANNON.Vec3(width / 2, height / 2, depth / 2)
  const shape = new CANNON.Box(halfSize);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(x, y, z),
    shape,
  });
  world.addBody(body);

  objects.push({ mesh, body });
}
cubeGenerator(1.5, 1.5, 1.5, 1, 10, 1);
cubeGenerator(1, 1, 1, 0, 5, 0);

// Create floor
function floorGenerator() {
  // Mesh
  const floorGeometry = new THREE.PlaneGeometry(far, far);
  const floorMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
  });
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.rotateX(-Math.PI / 2);
  scene.add(floorMesh);

  floorMesh.receiveShadow = true;

  // Physic
  const shape = new CANNON.Plane();
  const body = new CANNON.Body({
    mass: 0,
    shape
  });
  body.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5);
  world.addBody(body);
}
floorGenerator();

/**
 * Lights
 */
function addDirectionalLightHelper() {
  // 平行光光源对象
  const directionalLight = new THREE.DirectionalLight(0xffff00, 1);
  // 设置平行光光源位置（同聚光光源）
  directionalLight.position.set(-10, 10, -10);
  scene.add(directionalLight);

  // 设置用于计算阴影的光源对象
  directionalLight.castShadow = true;
  // 设置计算阴影的区域，最好刚好紧密包围在对象周围
  // 计算阴影的区域过大：模糊  过小：看不到或显示不完整
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 30;
  directionalLight.shadow.camera.left = -20;
  directionalLight.shadow.camera.right = 20;
  directionalLight.shadow.camera.top = 20;
  directionalLight.shadow.camera.bottom = -20;
  // 设置 mapSize 属性可以使阴影更清晰，不那么模糊
  directionalLight.shadow.mapSize.set(1024, 1024);

  // // 摄像机辅助对象
  // const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
  // scene.add(cameraHelper);
}
addDirectionalLightHelper();

function addSpotLight() {
  // 聚光光源对象
  const spotLight = new THREE.SpotLight(0xff00ff);
  // 设置聚光光源位置
  spotLight.position.set(5, 10, 5);
  scene.add(spotLight);

  // 设置聚光光源发散角度
  spotLight.angle = Math.PI / 6;
  // 设置用于计算阴影的光源对象
  spotLight.castShadow = true;
  // 设置计算阴影的区域，注意包裹对象的周围
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 20;
  spotLight.shadow.camera.fov = 2;
  spotLight.shadow.mapSize.set(1024, 1024);

  // // 摄像机辅助对象
  // const cameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  // scene.add(cameraHelper);
}
addSpotLight();

/**
 * Renderer
 */
const canvas = document.querySelector("canvas#webgl")!;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
// 允许在场景中使用阴影贴图
renderer.shadowMap.enabled = true;

/**
 * Utils
 */
// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = near;
controls.maxDistance = far;

// Axes
const axesHelper = new THREE.AxesHelper(far);
scene.add(axesHelper);

// Stats
const stats = Stats();
document.body.appendChild(stats.dom);

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;
function animate() {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  world.step(1 / 60, deltaTime, 3);

  for (const object of objects) {
    const position = object.body.position as unknown;
    const quaternion = object.body.quaternion as unknown;
    object.mesh.position.copy(position as THREE.Vector3);
    object.mesh.quaternion.copy(quaternion as THREE.Quaternion);
  }

  controls.update();
  stats.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
}
animate();

/**
 * Pane
 */
function initPane() {
  const pane = new Pane({ title: 'Physic' });
  pane.addButton({
    title: "Add cube"
  }).on("click", () => cubeGenerator(
    Math.random() * 2,
    Math.random() * 2,
    Math.random() * 2,
    (Math.random() - 0.5) * 10,
    10,
    (Math.random() - 0.5) * 10
  ));

  pane.addButton({
    title: "Clear"
  }).on("click", () => {
    for (const object of objects) {
      // Remove body
      world.removeBody(object.body)

      // Remove mesh
      scene.remove(object.mesh)
    }

    objects.splice(0, objects.length)
  });
}
initPane();

/**
 * Resize
 */
function onResize() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
}
window.addEventListener("resize", onResize);



