import {
  ACESFilmicToneMapping,
  AxesHelper,
  CanvasTexture,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PointLight,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector2,
  WebGLRenderer,
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
  light: PointLight

let group: Group

let animateId: number

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
  light = new PointLight(0xFFFFFF, 1000000)
  light.position.z = 600
  scene.add(light)

  // Object
  addTextureNormal()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.25

  // Stats
  stats = new Stats()
  document.body.appendChild(stats.dom)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 100
  controls.maxDistance = 800
  controls.update()

  // Resize
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function addTextureNormal() {
  group = new Group()

  const geometry = new SphereGeometry(80, 64, 32)
  let mesh: Mesh

  const textureLoader = new TextureLoader()

  // 碳纤维纹理贴图
  const diffuse = textureLoader.load(carbon1)
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
  group.add(mesh)

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
  group.add(mesh)

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
  group.add(mesh)

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
  group.add(mesh)

  scene.add(group)
}

function onResize() {
  const { width, height } = renderer.domElement
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  if (width !== W || height !== H) {
    camera.aspect = W / H
    camera.updateProjectionMatrix()

    renderer.setSize(W, H)
    renderer.setPixelRatio(DPI)
  }
}

function onDestroy() {
  try {
    window.cancelAnimationFrame(animateId)
    window.removeEventListener('destroy', onDestroy, false)
    window.removeEventListener('resize', onResize, false)
    renderer.dispose()
    renderer.forceContextLoss()
    const gl = renderer.domElement.getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    scene.clear()
  }
  catch (error) {
    console.error('Failed to destroy Three.js: ', error)
  }
}

function animate() {
  animateId = window.requestAnimationFrame(animate)

  const timer = Date.now() * 0.0016

  light.position.x = Math.sin(timer) * 600
  light.position.y = Math.cos(timer) * 600

  group.children.forEach((child) => {
    child.rotation.y += 0.005
  })

  render()
  stats.update()
}

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
