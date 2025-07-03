import {
  AxesHelper,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TextureLoader,
  WebGLRenderer,
} from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import url1 from '@/textures/Abstract_008_basecolor.jpg?url'
import url2 from '@/textures/Abstract_008_metallic.jpg?url'
import url3 from '@/textures/Abstract_008_bump.jpg?url'
import url4 from '@/textures/Abstract_008_normal.jpg?url'
import url5 from '@/textures/Abstract_008_roughness.jpg?url'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats,
  light: DirectionalLight

let animateId: number

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Camera
  camera = new PerspectiveCamera(40, innerWidth / innerHeight, 1, 1000)
  camera.position.set(0, 0, 600)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(300)
  scene.add(axesHelper)

  // Light
  light = new DirectionalLight(0xFFFFFF, 2.5)
  light.position.z = 600
  scene.add(light)

  // Object
  addTextureBump()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

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

function addTextureBump() {
  const geometry = new SphereGeometry(80, 64, 32)
  let material: MeshPhongMaterial
  let mesh: Mesh

  const textureLoader = new TextureLoader()
  const texture1 = textureLoader.load(url1)
  const texture2 = textureLoader.load(url2)
  const texture3 = textureLoader.load(url3)
  const texture4 = textureLoader.load(url4)
  const texture5 = textureLoader.load(url5)

  material = new MeshPhongMaterial({
    map: texture1,
    bumpMap: texture1,
    bumpScale: 3,
  })
  mesh = new Mesh(geometry, material)
  mesh.position.set(-120, 120, 0)
  scene.add(mesh)

  material = new MeshPhongMaterial({
    map: texture1,
    bumpMap: texture2,
    bumpScale: 3,
  })
  mesh = new Mesh(geometry, material)
  mesh.position.set(120, 120, 0)
  scene.add(mesh)

  material = new MeshPhongMaterial({
    map: texture1,
    bumpMap: texture3,
    bumpScale: 3,
  })
  mesh = new Mesh(geometry, material)
  mesh.position.set(120, -120, 0)
  scene.add(mesh)

  material = new MeshPhongMaterial({
    map: texture1,
    bumpMap: texture4,
    bumpScale: 3,
  })
  mesh = new Mesh(geometry, material)
  mesh.position.set(-120, -120, 0)
  scene.add(mesh)

  material = new MeshPhongMaterial({
    map: texture1,
    bumpMap: texture5,
    bumpScale: 3,
  })
  mesh = new Mesh(geometry, material)
  scene.add(mesh)
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

  light.position.x = Math.sin(timer) * 500
  light.position.y = Math.cos(timer) * 500

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
