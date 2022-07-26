import './style.css'
import {
  AxesHelper,
  CanvasTexture,
  DirectionalLight,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector2,
  WebGLRenderer,
  sRGBEncoding,
} from 'three'
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import golfball from '@/textures/golfball.jpg?url'
import water from '@/textures/Water_1_M_Normal.jpg?url'
import carbon1 from '@/textures/Carbon.png?url'
import carbon2 from '@/textures/Carbon_Normal.png?url'
import scratched from '@/textures/Scratched_gold_01_1K_Normal.png?url'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats,
  light: DirectionalLight

init()
animate()

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Canera
  camera = new PerspectiveCamera(40, innerWidth / innerHeight, 1, 1000)
  camera.position.set(0, 0, 600)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(300)
  scene.add(axesHelper)

  // Light
  light = new DirectionalLight(0xFFFFFF, 0.3)
  light.position.z = 600
  scene.add(light)

  // Object
  addTextureNormal()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)
  renderer.outputEncoding = sRGBEncoding

  // Stats
  stats = Stats()
  document.body.appendChild(stats.dom)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 100
  controls.maxDistance = 800
  controls.update()

  // Resize
  window.addEventListener('resize', onWindowResize)
}

function addTextureNormal() {
  const geometry = new SphereGeometry(80, 64, 32)
  let mesh: Mesh

  const textureLoader = new TextureLoader()

  // 碳纤维纹理贴图
  const diffuse = textureLoader.load(carbon1)
  diffuse.encoding = sRGBEncoding
  diffuse.wrapS = RepeatWrapping
  diffuse.wrapT = RepeatWrapping
  diffuse.repeat.x = 10
  diffuse.repeat.y = 10

  // 碳纤维纹理法线贴图
  const normalMap1 = textureLoader.load(carbon2)
  normalMap1.wrapS = RepeatWrapping
  normalMap1.wrapT = RepeatWrapping

  // 水波纹理法线贴图
  const normalMap2 = textureLoader.load(water)

  // 雪花材质法线贴图
  const normalMap3 = new CanvasTexture(new FlakesTexture())
  normalMap3.wrapS = RepeatWrapping
  normalMap3.wrapT = RepeatWrapping
  normalMap3.repeat.x = 10
  normalMap3.repeat.y = 6
  normalMap3.anisotropy = 16

  // 高尔夫球纹理法线贴图
  const normalMap4 = textureLoader.load(golfball)

  // 用于为 clear coat 层设置的独立的法线贴图
  const clearcoatNormalMap = textureLoader.load(scratched)

  // 汽车喷漆材质球 normalMap
  let material = new MeshPhysicalMaterial({
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    metalness: 0.9,
    roughness: 0.5,
    color: 0x0000FF,
    normalMap: normalMap3,
    normalScale: new Vector2(0.15, 0.15),
  })
  mesh = new Mesh(geometry, material)
  mesh.position.x = -100
  mesh.position.y = 100
  scene.add(mesh)

  // 碳纤维材质球  map + normalmap
  material = new MeshPhysicalMaterial({
    roughness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    map: diffuse,
    normalMap: normalMap1,
  })
  mesh = new Mesh(geometry, material)
  mesh.position.x = 100
  mesh.position.y = 100
  scene.add(mesh)

  // 高尔夫球 clearcoat + normalmap
  material = new MeshPhysicalMaterial({
    metalness: 0.0,
    roughness: 0.1,
    clearcoat: 1.0,
    normalMap: normalMap4,
    clearcoatNormalMap,
    clearcoatNormalScale: new Vector2(2.0, -2.0),
  })
  mesh = new Mesh(geometry, material)
  mesh.position.x = -100
  mesh.position.y = -100
  scene.add(mesh)

  // 台球 clearcoat + normalmap
  material = new MeshPhysicalMaterial({
    clearcoat: 1.0,
    metalness: 1.0,
    color: 0xFF0000,
    normalMap: normalMap2,
    normalScale: new Vector2(0.15, 0.15),
    clearcoatNormalMap,
    clearcoatNormalScale: new Vector2(2.0, -2.0),
  })
  mesh = new Mesh(geometry, material)
  mesh.position.x = 100
  mesh.position.y = -100
  scene.add(mesh)
}

function onWindowResize() {
  const { innerWidth, innerHeight } = window

  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)

  render()
}

function animate() {
  requestAnimationFrame(animate)

  const timer = Date.now() * 0.0016

  light.position.x = Math.sin(timer) * 500
  light.position.y = Math.cos(timer) * 500

  render()
  stats.update()
}

function render() {
  renderer.render(scene, camera)
}
