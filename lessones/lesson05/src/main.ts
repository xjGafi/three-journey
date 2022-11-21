import './style.css'
import {
  BufferGeometry,
  Float32BufferAttribute,
  LineDashedMaterial,
  LineSegments,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats

let dashCube: LineSegments

init()
animate()

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Camera
  camera = new PerspectiveCamera(60, innerWidth / innerHeight, 1, 500)
  camera.position.set(0, 0, 100)

  // Scene
  scene = new Scene()

  // Object
  const geometry = boxGeometry(50, 50, 50)
  const material = new LineDashedMaterial({
    color: 0x00FF00,
    dashSize: 3,
    gapSize: 1,
  })
  dashCube = new LineSegments(geometry, material)
  dashCube.computeLineDistances()
  scene.add(dashCube)

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 50
  controls.maxDistance = 100
  controls.update()

  // Stats
  stats = Stats()
  document.body.appendChild(stats.dom)

  // Resize
  window.addEventListener('resize', onWindowResize)
}

function boxGeometry(
  width: number,
  height: number,
  depth: number,
): BufferGeometry {
  width = width * 0.5
  height = height * 0.5
  depth = depth * 0.5

  const position = [
    -width,
    -height,
    -depth,
    -width,
    height,
    -depth,

    -width,
    height,
    -depth,
    width,
    height,
    -depth,

    width,
    height,
    -depth,
    width,
    -height,
    -depth,

    width,
    -height,
    -depth,
    -width,
    -height,
    -depth,

    -width,
    -height,
    depth,
    -width,
    height,
    depth,

    -width,
    height,
    depth,
    width,
    height,
    depth,

    width,
    height,
    depth,
    width,
    -height,
    depth,

    width,
    -height,
    depth,
    -width,
    -height,
    depth,

    -width,
    -height,
    -depth,
    -width,
    -height,
    depth,

    -width,
    height,
    -depth,
    -width,
    height,
    depth,

    width,
    height,
    -depth,
    width,
    height,
    depth,

    width,
    -height,
    -depth,
    width,
    -height,
    depth,
  ]
  const attribute = new Float32BufferAttribute(position, 3)
  const geometry = new BufferGeometry().setAttribute('position', attribute)

  return geometry
}

function onWindowResize() {
  const { innerWidth, innerHeight } = window

  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)

  render()
}

function animate() {
  const time = Date.now() * 0.001

  requestAnimationFrame(animate)

  dashCube.rotation.x = 0.25 * time
  dashCube.rotation.y = 0.25 * time

  render()
  stats.update()
}

function render() {
  renderer.render(scene, camera)
}
