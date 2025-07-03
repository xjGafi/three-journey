import {
  AxesHelper,
  BufferGeometry,
  CatmullRomCurve3,
  CurvePath,
  Line,
  LineBasicMaterial,
  LineCurve3,
  PerspectiveCamera,
  QuadraticBezierCurve3,
  Scene,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

const ACCURACY = 100 // 精度：数值越大，曲线越光滑
const TUBE_TUBULARSEGMENTS = 100 // 路径方向细分数，默认 64
const TUBE_RADIUS = 0.1 // 管道半径，默认 1
const TUBE_RADIUS_SEGMENTS = 10 // 管道圆弧细分数，默认 8

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Camera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 100)
  camera.position.set(0, 0, 10)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(100)
  scene.add(axesHelper)

  // Object
  addCurveByCatmullRomCurve3()
  addTubeByCatmullRomCurve3()
  addCurveByCurvePath()
  addTubeByCurvePath()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', render)
  controls.minDistance = 1
  controls.maxDistance = 80
  controls.update()

  // Resize
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function addCurveByCatmullRomCurve3() {
  const curve = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(1, 1, 1),
    new Vector3(2, -1, 1),
    new Vector3(3, 0, 0),
  ])

  const points = curve.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0xFF0000 })

  const line = new Line(geometry, material)
  scene.add(line)
}

function addTubeByCatmullRomCurve3() {
  const path = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(1, 1, 1),
    new Vector3(2, -1, 1),
    new Vector3(3, 0, 0),
  ])
  // 通过曲线路径创建生成管道
  const geometry = new TubeGeometry(
    path,
    TUBE_TUBULARSEGMENTS,
    TUBE_RADIUS,
    TUBE_RADIUS_SEGMENTS,
  )

  const material = new LineBasicMaterial({ color: 0xFF0000 })

  const line = new Line(geometry, material)
  line.position.y = 1
  scene.add(line)
}

function addCurveByCurvePath() {
  const curve1 = new QuadraticBezierCurve3(
    new Vector3(1, 0, 0),
    new Vector3(0, -1, 1),
    new Vector3(-1, 0, 0),
  )
  const curve2 = new QuadraticBezierCurve3(
    new Vector3(-1, 1, 0),
    new Vector3(0, 2, 1),
    new Vector3(1, 1, 0),
  )
  const line1 = new LineCurve3(new Vector3(1, 1, 0), new Vector3(1, 0, 0))
  const line2 = new LineCurve3(new Vector3(-1, 0, 0), new Vector3(-1, 1, 0))

  const curvePath = new CurvePath()
  curvePath.curves.push(line1, curve1, line2, curve2)
  const points = curvePath.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points as Array<Vector3>)

  const material = new LineBasicMaterial({ color: 0x00FF00 })

  const line = new Line(geometry, material)
  line.position.x = -1.25
  line.position.y = -1.25
  scene.add(line)
}

function addTubeByCurvePath() {
  const curve1 = new QuadraticBezierCurve3(
    new Vector3(1, 0, 0),
    new Vector3(0, -1, 1),
    new Vector3(-1, 0, 0),
  )
  const curve2 = new QuadraticBezierCurve3(
    new Vector3(-1, 1, 0),
    new Vector3(0, 2, 1),
    new Vector3(1, 1, 0),
  )
  const line1 = new LineCurve3(new Vector3(1, 1, 0), new Vector3(1, 0, 0))
  const line2 = new LineCurve3(new Vector3(-1, 0, 0), new Vector3(-1, 1, 0))

  const path: CurvePath<Vector3> = new CurvePath() // 创建 CurvePath 对象
  path.curves.push(line1, curve1, line2, curve2) // 插入多段线条
  // 通过曲线路径创建生成管道
  const geometry = new TubeGeometry(
    path,
    TUBE_TUBULARSEGMENTS,
    TUBE_RADIUS,
    TUBE_RADIUS_SEGMENTS,
    true,
  )

  const material = new LineBasicMaterial({ color: 0x00FF00 })

  const line = new Line(geometry, material)
  line.position.x = -1.25
  line.position.y = 1.25
  scene.add(line)
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

  render()
}

function onDestroy() {
  try {
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

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  render()
}
