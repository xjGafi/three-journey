import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  PointLight,
  AmbientLight,
  Group,
  Mesh,
  PlaneGeometry,
  BoxGeometry,
  SphereGeometry,
  TorusGeometry,
  MeshNormalMaterial,
  MeshBasicMaterial,
  MeshMatcapMaterial,
  TextureLoader,
  MeshDepthMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  Color,
  MeshToonMaterial,
  NearestFilter,
  MeshStandardMaterial,
  BufferAttribute,
  CubeTextureLoader
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import matcapsUrl from '@/textures/matcaps/1.png?url';
import gradientUrl from '@/textures/gradients/5.jpg?url';
// door
import doorColorUrl from '@/textures/door/color.jpg?url';
import doorAmbientOcclusionUrl from '@/textures/door/ambientOcclusion.jpg?url';
import doorHeightUrl from '@/textures/door/height.jpg?url';
import doorMetalnessUrl from '@/textures/door/metalness.jpg?url';
import doorRoughnessUrl from '@/textures/door/roughness.jpg?url';
import doorNormalUrl from '@/textures/door/normal.jpg?url';
import doorAlphaUrl from '@/textures/door/alpha.jpg?url';
// env
import envUrl1 from '@/textures/environmentMaps/0/px.jpg';
import envUrl2 from '@/textures/environmentMaps/0/nx.jpg';
import envUrl3 from '@/textures/environmentMaps/0/py.jpg';
import envUrl4 from '@/textures/environmentMaps/0/ny.jpg';
import envUrl5 from '@/textures/environmentMaps/0/pz.jpg';
import envUrl6 from '@/textures/environmentMaps/0/nz.jpg';

let camera: PerspectiveCamera,
  scene: Scene,
  pointLight: PointLight,
  renderer: WebGLRenderer,
  controls: OrbitControls;

let group: Group, plane: Mesh, cube: Mesh, sphere: Mesh, torus: Mesh;

init();
animate();

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  // Camera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 20);
  camera.position.z = 6;

  // Scene
  scene = new Scene();

  // Lights
  const ambientLight = new AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  pointLight = new PointLight(0xffffff, 0.5);
  pointLight.position.z = 5;
  scene.add(pointLight);

  // Object
  addObjects();

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, -2);
  controls.enableDamping = true;
  controls.minDistance = 5;
  controls.maxDistance = 15;

  // Resize
  window.addEventListener('resize', onResize);
}

function addObjects() {
  group = new Group();
  scene.add(group);

  const textureLoader = new TextureLoader();

  // const material = new MeshBasicMaterial({ color: 0x00ff00 });

  // 一种把法向量映射到 RGB 颜色的材质。
  // const material = new MeshNormalMaterial();
  // material.flatShading = true;

  // 由一个材质捕捉（MatCap，或光照球（Lit Sphere））纹理所定义，其编码了材质的颜色与明暗。
  // 由于 mapcap 图像文件编码了烘焙过的光照，不对灯光作出反应。
  // const matcapTextrue = textureLoader.load(matcapsUrl);
  // const material = new MeshMatcapMaterial();
  // material.matcap = matcapTextrue;

  // 一种按深度绘制几何体的材质。
  // 深度基于相机远近平面。白色最近，黑色最远。应用场景：雾
  // const material = new MeshDepthMaterial();

  // 一种非光泽表面的材质，没有镜面高光。
  // const material = new MeshLambertMaterial();

  // 一种用于具有镜面高光的光泽表面的材质。
  // const material = new MeshPhongMaterial();
  // material.shininess = 100;
  // material.specular = new Color(0xff0000);

  // 一种用于实现卡通着色的材质。
  // 可单独使用，也可以设置 gradientMap 后再使用
  // const gradientTexture = textureLoader.load(gradientUrl);
  // // 防止纹理贴图模糊，导致失去卡通效果
  // gradientTexture.minFilter = NearestFilter;
  // gradientTexture.magFilter = NearestFilter;
  // gradientTexture.generateMipmaps = true;
  // const material = new MeshToonMaterial();
  // material.gradientMap = gradientTexture;

  // 通用材质
  // const doorColorTexture = textureLoader.load(doorColorUrl);
  // const doorAmbientOcclusionTexture = textureLoader.load(
  //   doorAmbientOcclusionUrl
  // );
  // const doorHeightTexture = textureLoader.load(doorHeightUrl);
  // const doorMetalnessTexture = textureLoader.load(doorMetalnessUrl);
  // const doorRoughnessTexture = textureLoader.load(doorRoughnessUrl);
  // const doorNormalTexture = textureLoader.load(doorNormalUrl);
  // const doorAlphaTexture = textureLoader.load(doorAlphaUrl);

  // 一种基于物理的标准材质 (PBR)，使用 Metallic-Roughness 工作流程
  // const material = new MeshStandardMaterial();
  // // 颜色贴图
  // material.map = doorColorTexture;
  // // 环境遮挡贴图
  // material.aoMap = doorAmbientOcclusionTexture; // 该纹理的红色通道用作环境遮挡贴图。
  // material.aoMapIntensity = 1; // 环境遮挡效果的强度。默认值为1。零是不遮挡效果。
  // // 位移贴图
  // material.displacementMap = doorHeightTexture; // 位移贴图会影响网格顶点的位置，与仅影响材质的光照和阴影的其他贴图不同，移位的顶点可以投射阴影，阻挡其他对象， 以及充当真实的几何体。
  // material.displacementScale = 0.05; // 位移贴图对网格的影响程度（黑色是无位移，白色是最大位移）。
  // // 材质与金属的相似度
  // material.metalnessMap = doorMetalnessTexture; // 该纹理的蓝色通道用于改变材质的金属度。
  // material.metalness = 0; // 如木材或石材，使用 0.0，金属使用 1.0，通常没有中间值。 0.0 到 1.0 之间的值可用于生锈金属的外观。
  // // 材质的粗糙程度
  // material.roughnessMap = doorRoughnessTexture; // 该纹理的绿色通道用于改变材质的粗糙度。
  // material.roughness = 1; // 0.0 表示平滑的镜面反射，1.0 表示完全漫反射。
  // // 法线贴图
  // material.normalMap = doorNormalTexture; // 法线贴图不会改变曲面的实际形状，只会改变光照。
  // material.normalScale.set(0.5, 0.5);
  // // alpha 贴图
  // material.alphaMap = doorAlphaTexture; // alpha 贴图是一张灰度纹理，用于控制整个表面的不透明度。
  // material.transparent = true; // 定义此材质为透明，移除多余部分

  // 物理网格材质，MeshStandardMaterial 的扩展，提供了更高级的基于物理的渲染属性
  // const material = new MeshPhysicalMaterial();
  // // 颜色贴图
  // material.map = doorColorTexture;
  // // 环境遮挡贴图
  // material.aoMap = doorAmbientOcclusionTexture; // 该纹理的红色通道用作环境遮挡贴图。
  // material.aoMapIntensity = 1; // 环境遮挡效果的强度。默认值为1。零是不遮挡效果。
  // // 位移贴图
  // material.displacementMap = doorHeightTexture; // 位移贴图会影响网格顶点的位置，与仅影响材质的光照和阴影的其他贴图不同，移位的顶点可以投射阴影，阻挡其他对象， 以及充当真实的几何体。
  // material.displacementScale = 0.05; // 位移贴图对网格的影响程度（黑色是无位移，白色是最大位移）。
  // // 材质与金属的相似度
  // material.metalnessMap = doorMetalnessTexture; // 该纹理的蓝色通道用于改变材质的金属度。
  // material.metalness = 0; // 如木材或石材，使用 0.0，金属使用 1.0，通常没有中间值。 0.0 到 1.0 之间的值可用于生锈金属的外观。
  // // 材质的粗糙程度
  // material.roughnessMap = doorRoughnessTexture; // 该纹理的绿色通道用于改变材质的粗糙度。
  // material.roughness = 1; // 0.0 表示平滑的镜面反射，1.0 表示完全漫反射。
  // // 法线贴图
  // material.normalMap = doorNormalTexture; // 法线贴图不会改变曲面的实际形状，只会改变光照。
  // material.normalScale.set(0.5, 0.5);
  // // alpha 贴图
  // material.alphaMap = doorAlphaTexture; // alpha 贴图是一张灰度纹理，用于控制整个表面的不透明度。
  // material.transparent = true; // 定义此材质为透明，移除多余部分
  // material.clearcoat = 1; // clear coat 层的强度，当需要在表面加一层薄薄的半透明材质的时候，可以使用与 clear coat 相关的属性
  // material.clearcoatRoughness = 0; // clear coat 层的粗糙度

  const environmentMapTexture = new CubeTextureLoader().load([
    envUrl1,
    envUrl2,
    envUrl3,
    envUrl4,
    envUrl5,
    envUrl6
  ]);
  const material = new MeshStandardMaterial();
  material.metalness = 0.7;
  material.roughness = 0.2;
  // 环境贴图
  material.envMap = environmentMapTexture;

  plane = new Mesh(new PlaneGeometry(2, 2), material);
  plane.position.x = -6;
  plane.geometry.setAttribute(
    'uv2',
    new BufferAttribute(plane.geometry.attributes.uv.array, 2)
  );
  group.add(plane);

  cube = new Mesh(new BoxGeometry(2, 2, 2), material);
  cube.position.x = -2;
  cube.geometry.setAttribute(
    'uv2',
    new BufferAttribute(cube.geometry.attributes.uv.array, 2)
  );
  group.add(cube);

  sphere = new Mesh(new SphereGeometry(1, 20, 20), material);
  sphere.position.x = 2;
  sphere.geometry.setAttribute(
    'uv2',
    new BufferAttribute(sphere.geometry.attributes.uv.array, 2)
  );
  group.add(sphere);

  torus = new Mesh(new TorusGeometry(1, 0.5, 20, 30), material);
  torus.position.x = 6;
  torus.geometry.setAttribute(
    'uv2',
    new BufferAttribute(torus.geometry.attributes.uv.array, 2)
  );
  group.add(torus);
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

  const timer = Date.now() * 0.0003;

  pointLight.position.x = Math.sin(timer) * 3;
  pointLight.position.y = Math.cos(timer) * 4;

  controls.update();

  render();
}

function render() {
  renderer.render(scene, camera);
}
