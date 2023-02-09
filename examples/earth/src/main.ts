import './style.css'
import type { Group } from 'three'
import {
  Clock,
  CubeTextureLoader,
  DirectionalLight, Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  ReinhardToneMapping,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
} from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

import { Pane } from 'tweakpane'

import { starTextures } from './textures'

import earthModel from '@/models/earth/scene.gltf?url'
import satelliteModel from '@/models/satellite/scene.gltf?url'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  controls: OrbitControls,
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
  camera.position.set(1.8, 1, -2.7)

  // Scene
  scene = new Scene()

  // Objects
  initSkyBox()
  initModels()

  // Lights
  initLights()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
  })
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = sRGBEncoding
  renderer.toneMapping = ReinhardToneMapping
  renderer.toneMappingExposure = 3
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = near
  controls.maxDistance = far / 2
  controls.enableDamping = true

  // GUI
  initPane()

  // Stats
  stats = Stats()
  document.body.appendChild(stats.dom)

  // Resize
  window.addEventListener('resize', onWindowResize)
}

function animate() {
  requestAnimationFrame(animate)

  if (!PARAMS.pause) {
    const elapsedTime = clock.getElapsedTime()
    const time = elapsedTime - pauseTime

    if (earth)
      earth.rotation.y = time / 5

    if (satellite) {
      satellite.position.x = Math.sin(time * 1.2) * 2
      satellite.position.z = Math.cos(time * 1.2) * 3
    }
  }

  controls.update()
  stats.update()

  render()
}

function initSkyBox() {
  const cubeTextureLoader = new CubeTextureLoader()

  const environmentMap = cubeTextureLoader.load(starTextures)
  environmentMap.encoding = sRGBEncoding

  scene.background = environmentMap
  scene.environment = environmentMap
}

function updateAllMaterials() {
  scene.traverse((child) => {
    if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
      child.material.envMapIntensity = 2.5
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

function initModels() {
  // 3D Models
  const loader = new GLTFLoader()
  // earth
  loader.load(earthModel, (gltf) => {
    earth = gltf.scene
    scene.add(earth)

    updateAllMaterials()
  })
  // satellite
  loader.load(satelliteModel, (gltf) => {
    satellite = gltf.scene
    satellite.scale.set(0.5, 0.5, 0.5)
    scene.add(satellite)

    updateAllMaterials()
  })
}

function initLights() {
  const directionalLight = new DirectionalLight('#ffffff', 2)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.normalBias = 0.05
  directionalLight.position.set(0.25, 3, -1.25)
  scene.add(directionalLight)
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

function render() {
  renderer.render(scene, camera)
}
