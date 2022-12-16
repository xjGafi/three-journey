import './style.css'
import {
  BufferAttribute,
  DoubleSide,
  Group,
  Mesh,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import shaders from './shaders'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, controls: OrbitControls

let group: Group

init()
animate()

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Scene
  scene = new Scene()

  // Canera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.01, 100)
  camera.position.set(0, 0, 5)

  // Object
  meshGenerator()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // Listener
  window.addEventListener('resize', onResize, false)
}

function meshGenerator() {
  group = new Group()

  const SIZE = 1
  const SEGMENTS = 16
  const OFFSET = 2
  const MAX = 4
  let offsetY = 0

  const geometry = new PlaneBufferGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS)

  const { count } = geometry.attributes.position
  const randoms = new Float32Array(count)
  for (let i = 0; i < count; i++)
    randoms[i] = Math.random()
  geometry.setAttribute('aRandom', new BufferAttribute(randoms, 1))

  shaders.forEach((shader, index) => {
    const material = new ShaderMaterial({
      ...shader,
      side: DoubleSide,
      transparent: true,
      // wireframe: true,
    })
    const mesh = new Mesh(geometry, material)

    if (index % MAX === 0)
      offsetY -= OFFSET

    mesh.position.x = OFFSET * (index % MAX)
    mesh.position.y = offsetY

    // switch (index + 1) {
    //   case 3:

    //     break

    //   default:
    //     break
    // }
    group.add(mesh)
  })

  group.position.set(-7, 5, 0)
  scene.add(group)
}

function onResize() {
  const { width, height } = renderer.domElement
  const { innerWidth, innerHeight, devicePixelRatio } = window

  if (width !== innerWidth || height !== innerHeight) {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(innerWidth, innerHeight)
    renderer.setPixelRatio(devicePixelRatio)
  }
}

function animate() {
  requestAnimationFrame(animate)

  controls.update()

  render()
}

function render() {
  renderer.render(scene, camera)
}
