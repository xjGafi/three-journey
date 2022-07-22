import './style.css';
import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  1,
  500
);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

// Canvas
const canvas = document.querySelector('canvas#webgl')!;
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setSize(sizes.width, sizes.height);

// Object
// 定义材质
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
// 定义带有一些顶点的 几何体
const points = [
  new THREE.Vector3(-10, 0, 0),
  new THREE.Vector3(0, 10, 0),
  new THREE.Vector3(10, 0, 0)
];
const geometry = new THREE.BufferGeometry().setFromPoints(points);
// 组合线条
const line = new THREE.Line(geometry, material);
scene.add(line);

renderer.render(scene, camera);
