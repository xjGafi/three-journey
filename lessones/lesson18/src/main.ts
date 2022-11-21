import './style.css'
import {
  ArcCurve,
  AxesHelper,
  BufferGeometry,
  CubicBezierCurve,
  CurvePath,
  DoubleSide,
  LatheGeometry,
  Line,
  LineBasicMaterial,
  LineCurve,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  QuadraticBezierCurve,
  Scene,
  Shape,
  Vector2,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

const ACCURACY = 100 // 精度：数值越大，曲线越光滑
const LATHE_SEGMENTS = 50 // 圆周方向细分数，默认 12

init()
render()

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 100)
  camera.position.set(0, 0, 20)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(100)
  scene.add(axesHelper)

  // Object
  addCurveByCubicBezierCurve()
  addLatheByCubicBezierCurve()
  addCurveByQuadraticBezierCurve()
  addLatheByQuadraticBezierCurve()
  addCurveByCurvePath()
  addLatheByCurvePath()
  addCurveByShape()
  addLatheByShape()

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
  window.addEventListener('resize', onWindowResize)
}

function addCurveByCubicBezierCurve() {
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
  line.position.x = 7
  scene.add(line)
}

function addLatheByCubicBezierCurve() {
  const curve = new CubicBezierCurve(
    new Vector2(0, 0),
    new Vector2(1, 3),
    new Vector2(2, -3),
    new Vector2(3, 0),
  )
  const points = curve.getPoints(ACCURACY)
  const geometry = new LatheGeometry(points, LATHE_SEGMENTS) // 旋转造型

  const material = new MeshBasicMaterial({ color: 0xFF0000, side: DoubleSide })
  // material.wireframe = true; //线条模式渲染(查看细分数)

  const mesh = new Mesh(geometry, material)
  mesh.position.x = 7
  mesh.position.y = 2
  scene.add(mesh)
}

function addCurveByQuadraticBezierCurve() {
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

function addLatheByQuadraticBezierCurve() {
  const curve = new QuadraticBezierCurve(
    new Vector2(0, 0),
    new Vector2(1, 3),
    new Vector2(3, 0),
  )
  const points = curve.getPoints(ACCURACY)
  const geometry = new LatheGeometry(points, LATHE_SEGMENTS) // 旋转造型

  const material = new MeshBasicMaterial({ color: 0x00FF00, side: DoubleSide })
  // material.wireframe = true; //线条模式渲染(查看细分数)

  const mesh = new Mesh(geometry, material)
  mesh.position.y = 2
  scene.add(mesh)
}

function addCurveByCurvePath() {
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

  const curvePath = new CurvePath()
  curvePath.curves.push(line1, arc1, line2, arc2)
  const points = curvePath.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points as Array<Vector2>)

  const material = new LineBasicMaterial({ color: 0x0000FF })
  const line = new Line(geometry, material)
  line.position.x = -5
  scene.add(line)
}

function addLatheByCurvePath() {
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
  const geometry = new LatheGeometry(points as Array<Vector2>, LATHE_SEGMENTS) // 旋转造型

  const material = new MeshBasicMaterial({ color: 0x0000FF, side: DoubleSide })

  const mesh = new Mesh(geometry, material)
  mesh.position.x = -5
  mesh.position.y = 5
  scene.add(mesh)
}

function addCurveByShape() {
  const positions = [
    new Vector2(0, 0),
    new Vector2(1, 1),
    new Vector2(2, -1),
    new Vector2(3, 0),
  ]
  const shape = new Shape()
  shape.splineThru(positions) // 顶点带入样条插值计算函数
  const points = shape.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0xFFFF00 })
  // material.wireframe = true; // 线条模式渲染(查看细分数)

  const line = new Line(geometry, material)
  line.position.x = 14
  scene.add(line)
}

function addLatheByShape() {
  const positions = [
    new Vector2(0, 0),
    new Vector2(1, 1),
    new Vector2(2, -1),
    new Vector2(3, 0),
  ]
  const shape = new Shape()
  shape.splineThru(positions) // 顶点带入样条插值计算函数
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const points = shape.getPoints(ACCURACY)
  const geometry = new LatheGeometry(points, LATHE_SEGMENTS) // 旋转造型

  const material = new MeshBasicMaterial({ color: 0xFFFF00, side: DoubleSide })
  // material.wireframe = true; // 线条模式渲染(查看细分数)

  const mesh = new Mesh(geometry, material)
  mesh.position.x = 14
  mesh.position.y = 2
  scene.add(mesh)
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
