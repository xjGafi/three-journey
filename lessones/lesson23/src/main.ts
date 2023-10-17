import './style.css'
import {
  AxesHelper,
  DirectionalLight,
  ObjectLoader,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import lightmap from '@/models/lightmap/lightmap.json?url'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

init()

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Canera
  camera = new PerspectiveCamera(40, innerWidth / innerHeight, 1, 10000)
  camera.position.set(700, 200, -500)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(300)
  scene.add(axesHelper)

  // Light
  const light = new DirectionalLight(0xAABBFF, 0.3)
  light.position.x = 300
  light.position.y = 250
  light.position.z = -500
  scene.add(light)

  // Object
  addCubeByObjectLoader()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', render)
  controls.minDistance = 100
  controls.maxDistance = 800
  controls.update()

  // Resize
  window.addEventListener('resize', onWindowResize)
}

async function addCubeByObjectLoader() {
  const loader = new ObjectLoader()
  const object = await loader.loadAsync(lightmap)
  scene.add(object)

  render()
}

function onWindowResize() {
  const { innerWidth, innerHeight } = window

  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)

  render()
}

function render() {
  renderer.render(scene, camera)
}
