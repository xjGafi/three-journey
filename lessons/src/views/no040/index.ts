import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  Color,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

import { Pane } from 'tweakpane'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats,
  controls: OrbitControls

const geometry = new BufferGeometry()
const material = new PointsMaterial()
let points: Points

const PARAMS = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
  shape: 'heart',
}

const clock = new Clock()

let animateId: number

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Camera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 1, 100)
  camera.position.set(4, 4, -4)

  // Scene
  scene = new Scene()

  // Object
  geometryGenerator()
  materialGenerator()
  points = new Points(geometry, material)
  scene.add(points)

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // Pane
  initPane()

  // Stats
  stats = new Stats()
  document.body.appendChild(stats.dom)

  // Resize
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function geometryGenerator() {
  const positions = new Float32Array(PARAMS.count * 3)
  const colors = new Float32Array(PARAMS.count * 3)

  const colorInside = new Color(PARAMS.insideColor)
  const colorOutside = new Color(PARAMS.outsideColor)

  for (let i = 0; i < PARAMS.count; i++) {
    const i3 = i * 3

    const radius = Math.random() * PARAMS.radius

    // Position
    const spinAngle = radius * PARAMS.spin
    const branchAngle = ((i % PARAMS.branches) / PARAMS.branches) * Math.PI * 2
    const angle = branchAngle + spinAngle;

    // 一个点的坐标 (x, y, z)
    [positions[i3], positions[i3 + 1], positions[i3 + 2]] = getPositions(angle, radius) // x

    // Color
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / PARAMS.radius)

    // 一个点的颜色 rgb(r, g, b)
    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('color', new BufferAttribute(colors, 3))
}

function materialGenerator() {
  material.size = PARAMS.size
  material.transparent = true
  material.depthWrite = false // 防止 z-index 叠加时导致闪烁
  material.blending = AdditiveBlending // 设置混合模式
  material.vertexColors = true // 使用顶点着色器
}

function initPane() {
  const pane = new Pane({ title: 'Points' })
  pane
    .addBinding(PARAMS, 'count', {
      max: 500000,
      min: 10000,
      step: 100,
    })
    .on('change', geometryGenerator)
  pane
    .addBinding(PARAMS, 'size', {
      max: 0.1,
      min: 0.001,
      step: 0.001,
    })
    .on('change', materialGenerator)
  pane
    .addBinding(PARAMS, 'radius', {
      max: 20,
      min: 0.01,
      step: 0.01,
    })
    .on('change', geometryGenerator)
  pane
    .addBinding(PARAMS, 'branches', {
      max: 10,
      min: 1,
      step: 1,
    })
    .on('change', geometryGenerator)
  pane
    .addBinding(PARAMS, 'spin', {
      max: 5,
      min: -5,
      step: 0.001,
    })
    .on('change', geometryGenerator)
  pane
    .addBinding(PARAMS, 'randomness', {
      max: 2,
      min: 0,
      step: 0.001,
    })
    .on('change', geometryGenerator)
  pane
    .addBinding(PARAMS, 'randomnessPower', {
      max: 10,
      min: 1,
      step: 0.001,
    })
    .on('change', geometryGenerator)
  pane.addBinding(PARAMS, 'insideColor').on('change', geometryGenerator)
  pane.addBinding(PARAMS, 'outsideColor').on('change', geometryGenerator)
  pane.addBinding(PARAMS, 'shape', {
    options: {
      galaxy: 'galaxy',
      heart: 'heart',
    },
  }).on('change', geometryGenerator)
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

  const elapsedTime = clock.getElapsedTime()
  points.rotation.y = elapsedTime / 10

  controls.update()
  stats.update()

  render()
}

function render() {
  renderer.render(scene, camera)
}

function getPositions(angle: number, radius: number) {
  const positions = [getRandom(radius), getRandom(radius), getRandom(radius)]
  switch (PARAMS.shape) {
    case 'heart':
      positions[0] += Math.sin(angle) ** 3 * 4
      positions[1] += (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) / 4
      break

    default:
      positions[0] += Math.cos(angle) * radius
      positions[2] += Math.sin(angle) * radius
      break
  }
  return positions
}

function getRandom(radius: number) {
  return (
    Math.random() ** PARAMS.randomnessPower
    * (Math.random() < 0.5 ? 1 : -1)
    * PARAMS.randomness
    * radius
  )
}

export default function main() {
  init()
  animate()
}
