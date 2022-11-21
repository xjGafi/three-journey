import './style.css'
import {
  ArcCurve,
  AxesHelper,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  EllipseCurve,
  Line,
  LineBasicMaterial,
  LineCurve,
  LineCurve3,
  PerspectiveCamera,
  Scene,
  SplineCurve,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

const AMPLITUDE = 1 // 振幅（圆弧半径）：数值越大，曲线越陡峭 y = A * sin(x)
const ACCURACY = 100 // 精度：数值越大，曲线越光滑

init()
render()

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
  // 正弦曲线
  addCurveFloat32Array()
  addCurveByVector2()
  addCurveBySplineCurve()
  addCurveByCatmullRomCurve3()

  // 圆形
  addRingByArcCurve(1)
  addRingByVector2(1, 1)
  addRingByEllipseCurve(1, 1)

  // 椭圆形
  addRingByVector2(0.5, 1)
  addRingByEllipseCurve(0.5, 1)

  // 折线
  addLineByFloat32Array()
  addLineByVector2()

  // 直线
  addLineByLineCurve()
  addLineByLineCurve3()

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

function pi(piScale: number) {
  return Math.PI * piScale
}

function addCurveFloat32Array() {
  // 创建 x 轴 [0, 2π] 范围的坐标点
  const points = []
  let x = 0
  let y = 0
  do {
    points.push(x, y, 0)
    x += 1 / ACCURACY
    y = Math.sin(x) * AMPLITUDE
  } while (x.toFixed(3) <= pi(2).toFixed(3))
  // Float32Array 类型数组创建顶点位置 position 数据
  const positions = new Float32Array(points)
  // 创建 position 属性缓冲区对象
  const attribuePositions = new BufferAttribute(positions, 3)
  // 设置几何体 attributes 属性的 position 属性
  const geometry = new BufferGeometry().setAttribute(
    'position',
    attribuePositions,
  )

  const material = new LineBasicMaterial({ color: 0xFF0000 })
  const line = new Line(geometry, material)
  scene.add(line)
}

function addCurveByVector2() {
  const points = []
  // 批量生成圆弧上的顶点数据
  for (let i = 0; i <= ACCURACY; i++) {
    const angle = (pi(2) / ACCURACY) * i
    const x = angle
    const y = AMPLITUDE * Math.sin(angle)
    points.push(new Vector2(x, y))
  }
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0x00FF00 })
  const line = new Line(geometry, material)
  line.position.y = 0.1
  scene.add(line)
}

function addCurveBySplineCurve() {
  // 创建 x 轴 [0, 2π] 范围内的 5 个关键坐标点
  const curve = new SplineCurve([
    new Vector2(pi(0), 0),
    new Vector2(pi(1 / 2), 1 * AMPLITUDE),
    new Vector2(pi(1), 0),
    new Vector2(pi(3 / 2), -1 * AMPLITUDE),
    new Vector2(pi(2), 0),
  ])
  // 根据关键坐标点生成 ACCURACY + 1 个坐标点
  const points = curve.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0x0000FF })
  const line = new Line(geometry, material)
  line.position.y = 0.2
  scene.add(line)
}

function addCurveByCatmullRomCurve3() {
  const curve = new CatmullRomCurve3([
    new Vector3(pi(0), 0, 0),
    new Vector3(pi(1 / 2), 1 * AMPLITUDE, 0),
    new Vector3(pi(1), 0, 0),
    new Vector3(pi(3 / 2), -1 * AMPLITUDE, 0),
    new Vector3(pi(2), 0, 0),
  ])

  const points = curve.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0xFFFF00 })

  const line = new Line(geometry, material)
  line.position.y = 0.3
  scene.add(line)
}

function addRingByArcCurve(radiusScale: number) {
  const curve = new ArcCurve(0, 0, AMPLITUDE * radiusScale, 0, pi(2), true)
  // 根据关键坐标点生成 ACCURACY + 1 个坐标点
  const points = curve.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0xFF0000 })
  const line = new Line(geometry, material)
  scene.add(line)
}

function addRingByVector2(xRadiusScale: number, yRadiusScale: number) {
  const points = []
  // 批量生成圆弧上的顶点数据
  for (let i = 0; i <= ACCURACY; i++) {
    const angle = (pi(2) / ACCURACY) * i
    const x = AMPLITUDE * xRadiusScale * Math.sin(angle)
    const y = AMPLITUDE * yRadiusScale * Math.cos(angle)
    points.push(new Vector2(x, y))
  }
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0x00FF00 })
  const line = new Line(geometry, material)
  line.position.y = 0.1
  scene.add(line)
}

function addRingByEllipseCurve(xRadiusScale: number, yRadiusScale: number) {
  const curve = new EllipseCurve(
    0,
    0,
    AMPLITUDE * xRadiusScale,
    AMPLITUDE * yRadiusScale,
    0,
    pi(2),
    false, // 是否顺时针绘制，默认值为 false
    0,
  )
  const points = curve.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0x0000FF })
  const line = new Line(geometry, material)
  line.position.y = 0.2
  scene.add(line)
}

function addLineByFloat32Array() {
  const points = [0, 0, 0, 1, 1, 0, 2, -1, 0, 3, 0, 0]
  const positions = new Float32Array(points)
  const attribuePositions = new BufferAttribute(positions, 3)
  const geometry = new BufferGeometry().setAttribute(
    'position',
    attribuePositions,
  )

  const material = new LineBasicMaterial({ color: 0xFF0000 })
  const line = new Line(geometry, material)
  scene.add(line)
}

function addLineByVector2() {
  const points = [
    new Vector2(0, 0),
    new Vector2(1, 1),
    new Vector2(2, -1),
    new Vector2(3, 0),
  ]
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0x00FF00 })
  const line = new Line(geometry, material)
  line.position.y = 0.1
  scene.add(line)
}

function addLineByLineCurve() {
  const curve = new LineCurve(new Vector2(0, 0), new Vector2(1, 1))
  const points = curve.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0x0000FF })
  const line = new Line(geometry, material)
  line.position.y = 0.2
  scene.add(line)
}

function addLineByLineCurve3() {
  const curve = new LineCurve3(new Vector3(0, 0, 0), new Vector3(1, 1, 0))
  const points = curve.getPoints(ACCURACY)
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0xFFFF00 })
  const line = new Line(geometry, material)
  line.position.y = 0.3
  scene.add(line)
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
