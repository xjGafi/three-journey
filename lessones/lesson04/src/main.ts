import './style.css'
import {
  ACESFilmicToneMapping,
  AxesHelper,
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

import RoyalEsplanade from '@/textures/royal_esplanade_1k.hdr?url'
import DamagedHelmet from '@/models/DamagedHelmet.gltf?url'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats

init()
render()

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.25, 20)
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

    render()

    // 3D Model
    const loader = new GLTFLoader()
    loader.load(DamagedHelmet, (gltf) => {
      scene.add(gltf.scene)

      render()
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
  // 不要同时使用 requestAnimationFrame() 或 controls.addEventListener('change', render) 调用同一个函数，这样会冲突。
  controls.addEventListener('change', render)
  controls.minDistance = 2
  controls.maxDistance = 10
  controls.target.set(0, 0, -0.2)
  controls.update()

  // Stats
  stats = Stats()
  document.body.appendChild(stats.dom)

  // Resize
  window.addEventListener('resize', onWindowResize)
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
  stats && stats.update()
}
