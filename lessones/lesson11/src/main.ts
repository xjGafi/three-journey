import './style.css'
import {
  AxesHelper,
  BoxGeometry,
  Group,
  Line,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
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
import { Pane } from 'tweakpane'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats

let group: Group

let material: MeshBasicMaterial

init()
animate()

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Camera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000)
  camera.position.set(0, 0, 500)
  camera.lookAt(0, 0, 0)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(500)
  scene.add(axesHelper)

  // Object
  group = new Group()
  scene.add(group)
  addPointsCube()
  addLineCube()
  addLineLoopCube()
  addLineSegmentsCube()
  addMeshCube()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 50
  controls.maxDistance = 400
  controls.update()

  // Stats
  stats = Stats()
  document.body.appendChild(stats.dom)

  // Pane
  initPane()

  // Resize
  window.addEventListener('resize', onWindowResize)
}

function addPointsCube() {
  // 立方体几何对象
  const geometry = new BoxGeometry(80, 80, 80)
  // 点材质对象
  const material = new PointsMaterial({
    color: 0xFF0000,
    size: 10, // 点渲染尺寸
  })
  // 点模型对象
  const point = new Points(geometry, material)
  point.position.x = -200
  group.add(point)
}

function addLineCube() {
  // 立方体几何对象
  const geometry = new BoxGeometry(80, 80, 80)
  // 直线基础材质对象
  const material = new LineBasicMaterial({
    color: 0x00FF00,
  })
  // 线模型对象
  const line = new Line(geometry, material)
  line.position.x = -100
  group.add(line)
}

function addLineLoopCube() {
  // 立方体几何对象
  const geometry = new BoxGeometry(80, 80, 80)
  // 直线基础材质对象
  const material = new LineBasicMaterial({
    color: 0x0000FF,
  })
  // 线模型对象
  const lineLoop = new LineLoop(geometry, material)
  group.add(lineLoop)
}

function addLineSegmentsCube() {
  // 立方体几何对象
  const geometry = new BoxGeometry(80, 80, 80)
  // 直线基础材质对象
  const material = new LineBasicMaterial({
    color: 0xFFFF00,
  })
  // 线模型对象
  const lineSegments = new LineSegments(geometry, material)
  lineSegments.position.x = 100
  group.add(lineSegments)
}

function addMeshCube() {
  // 立方体几何对象
  const geometry = new BoxGeometry(80, 80, 80)
  // 直线基础材质对象
  material = new MeshBasicMaterial({
    color: 0x00FFFF,
  })
  // 线模型对象
  const mesh = new Mesh(geometry, material)
  mesh.position.x = 200
  group.add(mesh)
}

function initPane() {
  const pane = new Pane({ title: 'Material' })
  pane.addInput(material, 'wireframe')
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

  render()
  stats.update()
}

function render() {
  renderer.render(scene, camera)
}
