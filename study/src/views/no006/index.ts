import {
  AxesHelper,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats

let animateId: number

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Camera
  camera = new PerspectiveCamera(60, innerWidth / innerHeight, 1, 500)
  camera.position.set(200, 100, 300)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(500)
  scene.add(axesHelper)

  // Object
  addPointsMaterial()
  addLineDashedMaterial()
  addLineBasicMaterial()
  addMeshBasicMaterial()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 50
  controls.maxDistance = 300
  controls.update()

  // Stats
  stats = new Stats()
  document.body.appendChild(stats.dom)

  // Resize
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

// 一个具有六个顶点数据的几何体
function boxGeometry(): BufferGeometry {
  // 类型数组创建顶点位置 position 数据
  const vertices = new Float32Array([
    0,
    0,
    0, // 顶点 1 坐标
    50,
    0,
    0, // 顶点 2 坐标
    0,
    100,
    0, // 顶点 3 坐标
    0,
    0,
    10, // 顶点 4 坐标
    0,
    0,
    100, // 顶点 5 坐标
    50,
    0,
    10, // 顶点 6 坐标
  ])
  // 创建顶点位置 position 属性缓冲区对象，3 个为一组，表示一个顶点的 xyz 坐标
  const attribute = new BufferAttribute(vertices, 3)

  // 创建一个 Buffer 类型几何体对象
  const geometry = new BufferGeometry()
  // 设置几何体 attributes 属性的位置属性
  geometry.setAttribute('position', attribute)
  // geometry.attributes.position = attribute;

  return geometry
}

// 点渲染模式
function addPointsMaterial() {
  // 几何体对象
  const geometry = boxGeometry()
  // 点材质对象
  const material = new PointsMaterial({
    color: 0xFF0000,
    size: 5.0, // 点对象像素尺寸
  })
  // 点模型对象
  const points = new Points(geometry, material)
  points.position.set(-150, 0, 0)
  scene.add(points)
}

// 虚线渲染模式
function addLineDashedMaterial() {
  // 几何体对象
  const geometry = boxGeometry()
  // 虚线材质对象
  const material = new LineDashedMaterial({
    color: 0x00FF00,
    dashSize: 10, // 显示线段的大小，默认为 3
    gapSize: 5, // 间隙的大小，默认为 1
  })
  // 虚线模型对象
  const line = new Line(geometry, material)
  line.computeLineDistances()
  line.position.set(-50, 0, 0)
  scene.add(line)
}

// 实线渲染模式
function addLineBasicMaterial() {
  // 几何体对象
  const geometry = boxGeometry()
  // 实线材质对象
  const material = new LineBasicMaterial({
    color: 0x00FF00,
  })
  // 实线模型对象
  const line = new Line(geometry, material)
  line.position.set(50, 0, 0)
  scene.add(line)
}

// 三角面(网格)渲染模式
function addMeshBasicMaterial() {
  // 几何体对象
  const geometry = boxGeometry()
  // 三角面(网格)材质对象
  const material = new MeshBasicMaterial({
    color: 0x0000FF,
    side: DoubleSide, // 两面可见
  })
  // 三角面(网格)模型对象
  const mesh = new Mesh(geometry, material)
  mesh.position.set(150, 0, 0)
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

  // const time = Date.now() * 0.001;
  // scene.rotation.y = 0.25 * time;

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
