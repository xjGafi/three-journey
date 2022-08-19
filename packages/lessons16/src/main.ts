import "./style.css";
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AxesHelper,
  TextureLoader,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  AmbientLight,
  BoxGeometry,
  SphereGeometry,
  BufferGeometry,
  ImageLoader,
  Texture,
  DoubleSide,
  BufferAttribute,
  ObjectLoader,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import url from "@/textures/avatar.jpeg?url";

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer;

init();
render();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
  camera.position.set(0, 0, 300);

  // Scene
  scene = new Scene();

  // Axes
  const axesHelper = new AxesHelper(300);
  scene.add(axesHelper);

  // Light
  const ambient = new AmbientLight(0xffffff);
  scene.add(ambient);

  // Object
  addPlaneByPlaneGeometry();
  addPlaneByUV();

  // Renderer
  const canvas = document.querySelector("canvas#webgl")!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render);
  controls.minDistance = 100;
  controls.maxDistance = 800;
  controls.update();

  // Resize
  window.addEventListener("resize", onWindowResize);
}

function addPlaneByPlaneGeometry() {
  // 纹理贴图映射到一个矩形平面上
  const geometry = new PlaneGeometry(80, 80);
  textureLoader(geometry, -40, 40);
  imageLoader(geometry, -40, -40);
}

function addPlaneByUV() {
  // Float32Array 类型数组创建顶点位置 position 数据
  const vertices = new Float32Array([
    0,
    0,
    0, // 顶点 1 坐标
    80,
    0,
    0, // 顶点 2 坐标
    80,
    80,
    0, // 顶点 3 坐标
    0,
    80,
    0, // 顶点 4 坐标
  ]);
  // 创建 position 属性缓冲区对象
  const attribueVertices = new BufferAttribute(vertices, 3); // 3 个为一组

  // Float32Array 类型数据创建顶点法向量 normal 数据
  const normals = new Float32Array([
    0,
    0,
    1, // 顶点 1 法向量
    0,
    0,
    1, // 顶点 2 法向量
    0,
    0,
    1, // 顶点 3 法向量
    0,
    0,
    1, // 顶点 4 法向量
  ]);
  // 创建 normal 属性缓冲区对象
  const attribueNormals = new BufferAttribute(normals, 3); // 3 个为一组

  // Float32Array 类型数据创建顶点纹理坐标 uv 数据
  const uvs = new Float32Array([
    0,
    0, // 图片左下角
    1,
    0, // 图片右下角
    1,
    1, // 图片右上角
    0,
    1, // 图片左上角
  ]);
  // 创建 uv 属性缓冲区对象
  const attribueUVs = new BufferAttribute(uvs, 2);

  // Uint16Array 类型数组创建顶点索引 indexes 数据
  const indexes = new Uint16Array([
    0,
    1,
    2, // 第一个三角形
    2,
    3,
    0, // 第二个三角形
  ]);
  // 创建 indexes 属性缓冲区对象
  const attribueIndexes = new BufferAttribute(indexes, 1); // 1 个为一组

  const geometry = new BufferGeometry();
  // 设置几何体 attributes 属性的 position, normal, uv 属性
  geometry.setAttribute("position", attribueVertices);
  geometry.setAttribute("normal", attribueNormals);
  geometry.setAttribute("uv", attribueUVs);
  // 索引数据赋值给几何体的 index 属性
  geometry.setIndex(attribueIndexes);

  textureLoader(geometry, 0, 0);
  imageLoader(geometry, 0, -80);
}

function textureLoader(
  geometry: BufferGeometry,
  offsetX: number,
  offsetY: number
) {
  // TextureLoader 创建一个纹理加载器对象，可以加载图片作为几何体纹理
  const textureLoader = new TextureLoader();
  // 执行 load 方法，加载纹理贴图成功后，返回一个纹理对象 Texture
  textureLoader.load(url, (texture) => {
    const material = new MeshLambertMaterial({
      color: 0xff0000,
      map: texture, // 设置纹理贴图
      side: DoubleSide,
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(offsetX, offsetY, 0);
    scene.add(mesh);

    //纹理贴图加载成功后，调用渲染函数执行渲染操作
    render();
  });
}

function imageLoader(
  geometry: BufferGeometry,
  offsetX: number,
  offsetY: number
) {
  // ImageLoader 创建一个图片加载器对象，可以加载图片作为几何体纹理
  const imageLoader = new ImageLoader();
  // 执行 load 方法，加载图片成功后，返回一个 html 的元素 img 对象
  imageLoader.load(url, (image) => {
    // image 对象作为参数，创建一个纹理对象 Texture
    const texture = new Texture(image);
    // 下次使用纹理时触发更新
    texture.needsUpdate = true;
    const material = new MeshLambertMaterial({
      color: 0x00ff00,
      map: texture, // 设置纹理贴图
      side: DoubleSide,
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(offsetX, offsetY, 0);
    scene.add(mesh);

    //纹理贴图加载成功后，调用渲染函数执行渲染操作
    render();
  });
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
