import './style.css'
import type { Group } from 'three'
import {
  Clock,
  CubeTextureLoader,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Raycaster,
  ReinhardToneMapping,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

import { Pane } from 'tweakpane'

import { starTextures } from './textures'

import earthModel from '@/models/earth.glb?url'
import satelliteModel from '@/models/satellite.glb?url'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  controls: OrbitControls,
  stats: Stats

const near = 0.1
const far = 20

let earth: Group, satellite: Group

const clock = new Clock()
let pasueStartTime = 0
let pasueEndTime = 0
let pauseTime = 0

const raycaster = new Raycaster()
const pointer = new Vector2()

const pane = new Pane()
const PARAMS = {
  pause: false,
  speed: 1,
}

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
  stats = new Stats()
  document.body.appendChild(stats.dom)

  // Resize
  window.addEventListener('resize', onWindowResize)
}

function animate() {
  requestAnimationFrame(animate)

  if (!PARAMS.pause) {
    const elapsedTime = clock.getElapsedTime()

    // 移除暂停时间，保证动画无缝衔接
    const time = elapsedTime - pauseTime

    if (earth)
      earth.rotation.y = time / 5

    if (satellite) {
      satellite.position.x = Math.sin(time * PARAMS.speed) * 2
      satellite.position.z = Math.cos(time * PARAMS.speed) * 3
    }
  }

  controls.update()
  stats.update()

  render()
}

function initSkyBox() {
  const cubeTextureLoader = new CubeTextureLoader()

  // 加载全景图
  const environmentMap = cubeTextureLoader.load(starTextures)

  scene.background = environmentMap
  scene.environment = environmentMap
}

function initModels() {
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

    window.addEventListener('pointermove', onPointerMove)
  })
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

function getIntersect(event: PointerEvent) {
  const { innerWidth, innerHeight } = window

  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  pointer.set(
    (event?.clientX / innerWidth) * 2 - 1,
    -(event?.clientY / innerHeight) * 2 + 1,
  )

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(pointer, camera)

  // 计算物体和射线的焦点
  return raycaster.intersectObjects(satellite.children)
}

function onPointerMove(event: PointerEvent) {
  const intersects = getIntersect(event)

  const infoDom: HTMLElement = document.querySelector('.info')!

  if (intersects.length > 0) {
    // show
    PARAMS.pause = true

    infoDom.style.setProperty('--opacity', '1')
    infoDom.style.setProperty('--x', `${event.clientX}px`)
    infoDom.style.setProperty('--y', `${event.clientY}px`)
  }
  else {
    // hide
    PARAMS.pause = false
    infoDom.style.setProperty('--opacity', '0')
  }

  pane.refresh()
}

function initLights() {
  const directionalLight = new DirectionalLight(0xFFFFFF, 3)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.normalBias = 0.05
  directionalLight.position.set(0.25, 3, -1.25)
  scene.add(directionalLight)
}

function initPane() {
  pane.addBinding(PARAMS, 'pause').on('change', (item) => {
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
  pane.addBinding(PARAMS, 'speed', {
    min: 0.1,
    max: 2,
    step: 0.01,
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
