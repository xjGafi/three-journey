import {
  AxesHelper,
  BufferGeometry,
  DoubleSide,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Path,
  PerspectiveCamera,
  Scene,
  Shape,
  ShapeGeometry,
  Vector2,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

const ACCURACY = 100 // 精度：数值越大，曲线越光滑

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
  addCurveByShape()
  addCubeByShapeGeometry()
  addBoxByShapeGeometry()
  addArcByShapeGeometry()
  addCapsuleByShapeGeometry()
  addFaceByShapeGeometry()
  addFace2ByShapeGeometry()
  addSquareByShapeGeometry()

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

function addCurveByShape() {
  const UNIT = 2

  const positions = [
    new Vector2(-UNIT, UNIT),
    new Vector2(UNIT, UNIT),
    new Vector2(UNIT, -UNIT),
    new Vector2(-UNIT, -UNIT),
  ]
  const shape = new Shape()
  shape.splineThru(positions) // 顶点带入样条插值计算函数
  const points = shape.getPoints(ACCURACY)
  // setFromPoints 方法从 points 中提取数据改变几何体的顶点属性 vertices
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0xFF0000 })

  const line = new Line(geometry, material)
  scene.add(line)
}

function addCubeByShapeGeometry() {
  const UNIT = 2

  const positions = [
    new Vector2(-UNIT, UNIT),
    new Vector2(UNIT, UNIT),
    new Vector2(UNIT, -UNIT),
    new Vector2(-UNIT, -UNIT),
  ]
  // 通过顶点定义轮廓
  const shape = new Shape(positions)
  // shape 可以理解为一个需要填充轮廓
  // 所谓填充：ShapeGeometry 算法利用顶点计算出三角面 face3 数据填充轮廓
  const geometry = new ShapeGeometry(shape, ACCURACY)

  const material = new LineBasicMaterial({ color: 0x00FF00 })

  const line = new Line(geometry, material)
  scene.add(line)
}

function addBoxByShapeGeometry() {
  const UNIT = 1

  // 通过 shpae 基类 path 的方法绘制轮廓（本质也是生成顶点）
  const shape = new Shape()
  // 四条直线绘制一个矩形轮廓
  shape.moveTo(-UNIT, UNIT) // 第 1 点(起点)
  shape.lineTo(UNIT, UNIT) // 第 2 点
  shape.lineTo(UNIT, -UNIT) // 第 3 点
  shape.lineTo(-UNIT, -UNIT) // 第 4 点
  const geometry = new ShapeGeometry(shape, ACCURACY)

  const material = new LineBasicMaterial({ color: 0x00FF00 })

  const line = new Line(geometry, material)
  scene.add(line)
}

function addArcByShapeGeometry() {
  // 通过 shpae 基类 path 的方法绘制轮廓（本质也是生成顶点）
  const shape = new Shape()
  shape.absarc(0, 0, 2, 0, 2 * Math.PI, false) // 圆弧轮廓
  const geometry = new ShapeGeometry(shape, ACCURACY)

  const material = new LineBasicMaterial({ color: 0x0000FF })

  const line = new Line(geometry, material)
  scene.add(line)
}

function addCapsuleByShapeGeometry() {
  const R = 1

  const shape = new Shape()
  shape.absarc(0, 0, R, 0, Math.PI, false)
  // shape.lineTo(-R, -2);
  shape.absarc(0, -2, R, Math.PI, 2 * Math.PI, false)
  // shape.lineTo(R, 0);
  const geometry = new ShapeGeometry(shape, ACCURACY)

  const material = new MeshBasicMaterial({ color: 0xFFFF00, side: DoubleSide })
  // material.wireframe = true;

  const mesh = new Mesh(geometry, material)
  mesh.position.x = 4
  mesh.position.y = 1
  scene.add(mesh)
}

function addFaceByShapeGeometry() {
  const R = 2

  // 外轮廓（脸）
  const shape = new Shape()
  shape.arc(0, 0, R, 0, 2 * Math.PI, false)

  // 内轮廓（嘴巴）
  const path1 = new Path()
  path1.arc(0, -R / 2, R / 4, 0, 2 * Math.PI, false)
  // 内轮廓（鼻子）
  const path2 = new Path()
  path2.arc(0, -R / 12, R / 20, 0, 2 * Math.PI, false)
  // 内轮廓（左眼）
  const path3 = new Path()
  path3.arc(R / 2, R / 4, R / 8, 0, 2 * Math.PI, false)
  // 内轮廓（右眼）
  const path4 = new Path()
  path4.arc(-R / 2, R / 4, R / 8, 0, 2 * Math.PI, false)
  // 内轮廓分别插入到 holes 属性中
  shape.holes.push(path1, path2, path3, path4)
  const geometry = new ShapeGeometry(shape, ACCURACY)

  const material = new MeshBasicMaterial({ color: 0x00FFFF, side: DoubleSide })
  // material.wireframe = true;

  const mesh = new Mesh(geometry, material)
  mesh.position.x = 8
  scene.add(mesh)
}

function addFace2ByShapeGeometry() {
  const R = 2

  // 内轮廓（嘴巴）
  const shape1 = new Shape()
  shape1.arc(0, -R / 2, R / 4, 0, 2 * Math.PI, false)
  // 内轮廓（鼻子）
  const shape2 = new Shape()
  shape2.arc(0, -R / 12, R / 20, 0, 2 * Math.PI, false)
  // 内轮廓（左眼）
  const shape3 = new Shape()
  shape3.arc(R / 2, R / 4, R / 8, 0, 2 * Math.PI, false)
  // 内轮廓（右眼）
  const shape4 = new Shape()
  shape4.arc(-R / 2, R / 4, R / 8, 0, 2 * Math.PI, false)
  const geometry = new ShapeGeometry(
    [shape1, shape2, shape3, shape4],
    ACCURACY,
  )

  const material = new MeshBasicMaterial({ color: 0x00FFFF, side: DoubleSide })
  // material.wireframe = true;

  const mesh = new Mesh(geometry, material)
  mesh.position.x = 8
  mesh.position.y = 4
  scene.add(mesh)
}

function addSquareByShapeGeometry() {
  const UNIT = 2

  const shape = new Shape()
  shape.moveTo(-UNIT, UNIT)
  shape.lineTo(UNIT, UNIT)
  shape.lineTo(UNIT, -UNIT)
  shape.lineTo(-UNIT, -UNIT)

  const path = new Path()
  path.moveTo(-UNIT / 2, UNIT / 2)
  path.lineTo(UNIT / 2, UNIT / 2)
  path.lineTo(UNIT / 2, -UNIT / 2)
  path.lineTo(-UNIT / 2, -UNIT / 2)

  shape.holes.push(path)
  const geometry = new ShapeGeometry(shape, ACCURACY)

  const material = new MeshBasicMaterial({ color: 0xFF00FF, side: DoubleSide })
  // material.wireframe = true;

  const mesh = new Mesh(geometry, material)
  mesh.position.x = -5
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
