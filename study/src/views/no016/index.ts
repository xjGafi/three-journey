import {
  ArcCurve,
  AxesHelper,
  BufferGeometry,
  CubicBezierCurve,
  CubicBezierCurve3,
  CurvePath,
  Line,
  LineBasicMaterial,
  LineCurve,
  PerspectiveCamera,
  QuadraticBezierCurve,
  QuadraticBezierCurve3,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

const ACCURACY = 100 // 精度：数值越大，曲线越光滑

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 100)
  camera.position.set(0, 0, 10)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(100)
  scene.add(axesHelper)

  // Object
  addCubicBezierCurve()
  addQuadraticBezierCurve()
  addCubicBezierCurve3()
  addQuadraticBezierCurve3()
  addCurvePath()

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

function addCubicBezierCurve() {
  const curve = new CubicBezierCurve(
    new Vector2(0, 0),
    new Vector2(1, 3),
    new Vector2(2, -3),
    new Vector2(3, 0),
  )

  const points = curve.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0xFF0000 })

  const line = new Line(geometry, material)
  scene.add(line)
}

function addQuadraticBezierCurve() {
  const curve = new QuadraticBezierCurve(
    new Vector2(0, 0),
    new Vector2(1, 3),
    new Vector2(3, 0),
  )

  const points = curve.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0x00FF00 })

  const line = new Line(geometry, material)
  scene.add(line)
}

function addCubicBezierCurve3() {
  const curve = new CubicBezierCurve3(
    new Vector3(0, 0, 0),
    new Vector3(1, 3, -3),
    new Vector3(2, -3, 3),
    new Vector3(3, 0, 0),
  )

  const points = curve.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0x0000FF })

  const line = new Line(geometry, material)
  scene.add(line)
}

function addQuadraticBezierCurve3() {
  const curve = new QuadraticBezierCurve3(
    new Vector3(0, 0, 0),
    new Vector3(1, 3, -3),
    new Vector3(3, 0, 0),
  )

  const points = curve.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0xFFFF00 })

  const line = new Line(geometry, material)
  scene.add(line)
}

function addCurvePath() {
  const RADIUS = 1
  const HEIGHT = 2
  const arc1 = new ArcCurve(0, 0, RADIUS, 0, Math.PI, true)
  const arc2 = new ArcCurve(0, HEIGHT, RADIUS, Math.PI, 0, true)
  const line1 = new LineCurve(
    new Vector2(RADIUS, HEIGHT),
    new Vector2(RADIUS, 0),
  )
  const line2 = new LineCurve(
    new Vector2(-RADIUS, 0),
    new Vector2(-RADIUS, HEIGHT),
  )

  const curvePath = new CurvePath() // 创建 CurvePath 对象
  curvePath.curves.push(line1, arc1, line2, arc2) // 插入多段线条
  const points = curvePath.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points as Array<Vector2>)

  const material = new LineBasicMaterial({ color: 0x00FFFF })
  const line = new Line(geometry, material)
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
