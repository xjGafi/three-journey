import './style.css'
import type { Group } from 'three'
import {
  ACESFilmicToneMapping,
  AxesHelper,
  Clock,
  EquirectangularReflectionMapping,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

import { Pane } from 'tweakpane'
import RoyalEsplanade from '@/textures/royal_esplanade_1k.hdr?url'
import earthModel from '@/models/earth/scene.gltf?url'
import satelliteModel from '@/models/satellite/scene.gltf?url'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats

const near = 0.1
const far = 20

let earth: Group, satellite: Group

const PARAMS = {
  pause: false,
}

const clock = new Clock()
let pasueStartTime = 0
let pasueEndTime = 0
let pauseTime = 0

init()
animate()

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Canera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, near, far)
  camera.position.set(-1.8, 0.6, 2.7)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(100)
  scene.add(axesHelper)

  // Object
  new RGBELoader().load(RoyalEsplanade, (texture) => {
    texture.mapping = EquirectangularReflectionMapping

    scene.background = texture
    scene.environment = texture

    // 3D Models
    const loader = new GLTFLoader()
    // earth
    loader.load(earthModel, (gltf) => {
      earth = gltf.scene
      scene.add(earth)
    })
    // satellite
    loader.load(satelliteModel, (gltf) => {
      satellite = gltf.scene
      satellite.scale.set(0.5, 0.5, 0.5)
      // satellite.position.set(2, 0, 3)
      scene.add(satellite)
    })
  })

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.outputEncoding = sRGBEncoding

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = near
  controls.maxDistance = far / 2
  controls.update()

  // GUI
  initPane()

  // Stats
  stats = Stats()
  document.body.appendChild(stats.dom)

  // Resize
  window.addEventListener('resize', onWindowResize)
}

function initPane() {
  const pane = new Pane()
  pane.addInput(PARAMS, 'pause').on('change', (item) => {
    const elapsedTime = clock.getElapsedTime()

    if (item.value) {
      pasueStartTime = elapsedTime
    }
    else {
      pasueEndTime = elapsedTime

      const time = pasueEndTime - pasueStartTime
      pauseTime += time
    }
  })
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

  if (!PARAMS.pause) {
    const elapsedTime = clock.getElapsedTime()
    const time = elapsedTime - pauseTime

    if (earth)
      earth.rotation.y = time / 5

    if (satellite) {
      satellite.position.x = Math.sin(time) * 2
      satellite.position.z = Math.cos(time) * 3
    }
  }

  render()
}

function render() {
  renderer.render(scene, camera)
  stats && stats.update()
}
